var express = require('express');
var router = express.Router();
const usermodal =require("./users");
const postmodal =require("./post");
const passport = require('passport');
const localstragy= require("passport-local");
const upload= require('./Multer');
passport.use(new localstragy(usermodal.authenticate()));


router.get('/', function(req, res, next) {
  res.render('index',{nav:false,error:req.flash('error')});
});

router.get ('/register' , function(req, res , next){
res.render('register',{nav:false})
})

router.get ('/profile',isloggedin , async function(req, res , next){
  const user = await usermodal.findOne({username: req.session.passport.user})
  .populate("posts")
  res.render('profile',{user,nav:true})
})

router.get('/feed',isloggedin , async function(req, res , next){
  const user = await usermodal.findOne({username: req.session.passport.user})
  const Postdata =await postmodal.find()
  .populate("users")
  res.render("feed",{user,Postdata,nav:true})
})

router.get ('/show/posts',isloggedin , async function(req, res , next){
  const user = await usermodal.findOne({username: req.session.passport.user})
  .populate("posts")
  res.render('show',{user,nav:true})
})

router.post('/createpost',isloggedin,upload.single("postimage") , async function(req, res , next){
  const user = await usermodal.findOne({username: req.session.passport.user});
 const post = await postmodal.create({
  users: user._id,
  title: req.body.title,
  description: req.body.description,
  postImage: req.file.filename,
 })
 user.posts.push(post._id)
 await user.save();
  res.redirect('/profile')
})

router.get ('/add',isloggedin , async function(req, res , next){
  const user = await usermodal.findOne({username: req.session.passport.user});
  res.render('add',{user,nav:true})
})

router.post ('/fileupload',isloggedin,upload.single('image') , async function(req, res , next){
const user = await usermodal.findOne({username: req.session.passport.user});
user.profileImage= req.file.filename;
await user.save();
res.redirect("/profile")
})

router.post('/register' , function(req, res , next){
const data= new usermodal({
  username:req.body.username,
  email:req.body.email,
  name:req.body.fullname,
  contact: req.body.contact
})
usermodal.register(data, req.body.password)
.then(function(){
  passport.authenticate("local")(req,res, function(){
    res.redirect("/profile")
  })
})
})

router.post('/login' ,passport.authenticate("local", {
  successRedirect:"/profile",
  failureRedirect:"/",
  failureFlash:true,
}),function(req,res,next){

})

router.get("/logout", function(req,res,next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

function isloggedin(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/")
}
module.exports = router;
