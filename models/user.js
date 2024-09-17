const { Schema, model } = require("mongoose")
const { createHmac, randomBytes } = require("crypto")
const { createTokenForUser } = require("../service/authentication")

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password:{
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: '/images/default.jpg'
    }
}, { timestamps: true})

userSchema.static('matchPasswordAndGenerateToken', async function(email, password){
    const user = await this.findOne({email})
    if (!user) {throw new Error("User not found")}
    

    const salt = user.salt
    const hashedPassword = user.password

    const providedPassword = createHmac('sha256', salt).update(password).digest('hex')

    if (hashedPassword !== providedPassword){
        throw new Error("Password not matching")
    }

    const token = createTokenForUser(user)
    return token;
})


// this function is executed just before the object or user details is stored in database
userSchema.pre("save", function (next) {
    const user = this
    if(!user.isModified("password")) return;
    const salt = randomBytes(16).toString()
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest('hex')

    // here each user will have its own secret key for hashing stored in database. 
    this.salt = salt
    this.password = hashedPassword
    next()
})

const User = model('user', userSchema)

module.exports = User