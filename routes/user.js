const {Router} = require("express")
const User = require("../models/user")
const multer = require("multer")
const path = require("path")
const {createDirectory} = require("../service/createdir")

const router = Router();

const profileDir = path.join("public", "images");

createDirectory(profileDir);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/images/`))
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`
      cb(null, fileName)
    }
  })
  
const upload = multer({ storage: storage })

router.get('/signin', (req, res) => {
    return res.render('signin')
})

router.get('/signup', (req, res) => {
    return res.render('signup')
})

router.post('/signup', upload.single("profileImage"), async (req, res) => {
    const {fullName, email, password} = req.body

    await User.create({
        fullName,
        email,
        password,
        profileImageURL: (!req.file)? '/images/default.jpg' : `/images/${req.file.filename}` 
    })
    console.log("user created");
    
    return res.redirect("/")
})

router.post("/signin",  async (req, res) =>{
    const {email, password} = req.body
    
    try{

        const token = await User.matchPasswordAndGenerateToken(email, password)

        return res.cookie("token", token).redirect("/")
        
    }catch(error){
        return res.render('signin', {error: "Incorrect email or password"})
    }
    
})

router.get("/logout", (req, res) => {
    res.clearCookie("token").redirect("/")
})


module.exports = router;