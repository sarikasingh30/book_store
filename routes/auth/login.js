const express = require("express")
const router = express.Router()
const myPassport = require("../../auth/passport");
router.post("/", myPassport.authenticate('local', { failureRedirect: '/login' }),
    function (req, res) {
        // console.log(req.user,"login.......done")
        res.redirect('/books');
    }
)
router.get('/google',
    myPassport.authenticate('google', { scope: ['books'] }));
  
router.get('/auth/google/callback', 
    myPassport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/books');
    });

module.exports = router