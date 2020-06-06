require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const ejs = require('ejs');
const app=express();
const mongoose = require('mongoose');
const encrypt=require("mongoose-encryption");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true,useUnifiedTopology: true });
const userSchema=new mongoose.Schema({
  email:String,
  password:String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields: ['password'] });
var warning="";
const User=mongoose.model("User",userSchema);
app.get("/",function(req,res){
  res.render("home");
});
app.get("/login",function(req,res){
  res.render("login",{warning:""});
});

app.get("/register",function(req,res){
  res.render("register",{warning:warning});
});
app.post("/register",function(req,res){
  User.findOne({email:req.body.username},function(err,result){
    if(result)
    {
      res.render("register",{warning:"user already exists!"});
    }
    else
    {
      const newuser=new User({
        email:req.body.username,
        password:req.body.password
      });
      newuser.save(function(err)
    {
      if(err)
      {
        console.log("error");
      }
      else
      {
        res.render("secrets");
      }
    });
    }

});

});
app.post("/login",function(req,res){
  User.findOne({email:req.body.username},function(err,result){

    if(result)
    {

      if(result.password===req.body.password)
      {
        res.render("secrets");
      }
      else
      {
        res.render("login",{warning:"Wrong password"});
      }
      ////////////////////////////////////////////////We are using encryption now////////////////////////////////////////
  //     User.findOne({email:req.body.username,password:req.body.password},function(er,resul){
  //       if(!er)
  //       {
  //         if(resul)
  //         {
  //           res.render("secrets");
  //         }
  //         else{
  //
  //           res.render("login",{warning:"Wrong password"});
  //         }
  //
  //       }
  //
  //
  // });
}
else
{

    res.render("login",{warning:"User does not exists please register first"});

}
});
});
app.listen(3000,function(){
  console.log("server started at port 3000");
});
