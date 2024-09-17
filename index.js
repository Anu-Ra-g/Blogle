const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const Blog = require("./models/blog")
const User = require("./models/user")

require('dotenv').config();

const URL = process.env.MONGO_URL

mongoose.connect(URL).then(console.log("Connected to database")).catch((err) => console.log(err));

const userRoute = require("./routes/user")
const blogRoute = require("./routes/blog")
const { checkForAuthenticationCookie } = require('./middlewares/authentication')

const app = express()
const PORT = process.env.PORT


app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(checkForAuthenticationCookie('token'))
app.use(express.static(path.resolve("./public")))

app.get("/",async( req, res)=> {
    const allBlogs = await Blog.find({})

    const user = await User.findOne({email: req.user?.email})
    
    res.render("home", {user: (!req.user.fullName)? req.user: user, blogs: allBlogs})
})

app.use('/user', userRoute)
app.use('/blog', blogRoute)

app.listen(PORT, () => console.log(`Server running on ${PORT}`))