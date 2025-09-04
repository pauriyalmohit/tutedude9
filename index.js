const express = require('express');
const bodyParser = require('body-parser');

var app = express();
app.set("view engine","ejs");
app.set("views", __dirname + "/views");
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/secrets");

const userSchema= new mongoose.Schema({
    email:String,
    password:String
});

const item = mongoose.model("User",userSchema);
 
app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/register",(req,res)=> {
    res.render("register");
});

app.post("/register",async(req,res)=>{
   try{
      const newUser = new item({
        email: req.body.username,
        password: req.body.password
    });

    await newUser.save();
    res.render("secret");
   } catch (err) {
    console.error("registration Error",err);
    res.send("Error while registering user")
   }
});

app.post("/login",async(req,res) => {
    try{
    const username = req.body.username;
    const password = req.body.password;

    const foundUser =await item.findOne({email: username});

    if(foundUser){
        if (foundUser.password === password){
            res.render("secret");
        } else {
            res.send("wrong password");
        }
    } else {
        res.send ("user not found");
    }
} catch (err) {
    console.error(err);
    res.send("something went wrong");
}
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.listen(5000,() =>{
    console.log("server started on port 5000");
});
