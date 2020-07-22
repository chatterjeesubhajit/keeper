const router = require("express").Router();
const passport = require("passport");
const CLIENT_HOME_PAGE_URL = "/home/";
const CLIENT_LOGIN_PAGE_URL = "/";
const User = require("../models/users");

// when login is successful, retrieve user info
router.get("/login/success", (req, res) => {
    console.log("reached");
    if (req.user) {
      console.log("user details below: ");
      console.log(req.user);
      User.findOne({userId:req.user.userId},(err,obj)=>{
        let userNotes=[];
        if(!err){
          if(obj)
          {
            userNotes=obj.notes;
          }
          res.json({
          success: true,
          message: "user has successfully authenticated",
          user: req.user,
          cookies: req.cookies,
          notes:userNotes
            }); 
          }
      })
    }
    else
    {
      res.json({
        success: false,
        message: "user authentication failed",
        user: {},
        cookies: {},
        notes:[]
          }); 
    }
  });


// when login failed, send failed msg
router.get("/login/failed", (req, res) => {
    res.status(401).json({
      success: false,
      message: "user failed to authenticate."
    });
  });

  // When logout, redirect to client
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect(CLIENT_LOGIN_PAGE_URL);
  });


  
router.get('/facebook',
passport.authenticate('facebook'));



// redirect to home page after successfully login via twitter
// router.get(
//     "/facebook/redirect",
//     passport.authenticate("facebook", {
//       successRedirect: CLIENT_HOME_PAGE_URL,
//       failureRedirect: "/auth/login/failed"
//     })
//   );

router.get("/facebook/redirect",
passport.authenticate('facebook', { failureRedirect: '/auth/login/failed' }),
function(req, res) {
  console.log(`${CLIENT_HOME_PAGE_URL}${req.user.displayName}`);
  res.redirect(`${CLIENT_HOME_PAGE_URL}${req.user.displayName}`);
});


  module.exports = router;