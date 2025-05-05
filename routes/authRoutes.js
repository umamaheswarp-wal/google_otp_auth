const express = require('express');
const router = express.Router();
const passport = require('passport');
const { otpLogin, otpVerify, generate2FA, verify2FA } = require('../controllers/authController');



router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
     accessType: 'offline'
  //  prompt: 'consent'
  })
);



router.get('/', (req, res) => {
  res.send(`<h2>Welcome</h2><a href="/auth/google">Login with Google</a>`);
});


router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
  
    res.redirect('/auth/2fa/setup');
  }
);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated() && req.session.twoFA) return next();
  res.redirect('/');
}

router.get('/dashboard', isLoggedIn, (req, res) => {
  const user = req.user;
  console.log('Logged-in user:', {
    name: user.displayName,
    email: user.emails[0].value,
    id: user.id
  });
  res.send('<h1 style="text-align:center; margin-top:50px;">WELCOME TO AFP MEMORIAL GO</h1>');
});




router.get('/2fa/setup', generate2FA);
router.post('/2fa/verify', express.urlencoded({ extended: false }), verify2FA);

router.post('/otp/login', otpLogin);
router.post('/otp/verify', otpVerify);

module.exports = router;
