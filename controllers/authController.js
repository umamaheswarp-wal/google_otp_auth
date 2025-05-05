const { sendOtp, generateOtp } = require('../services/otpService');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const otpStorage = {};

async function generate2FA(req, res) {
    try {
      const { email } = req.user;
  
      const secret = speakeasy.generateSecret({
        name: `2FA-Google(${email})`
      });
  
      req.session.twoFASecret = secret.base32;
  
      const qrDataUrl = await qrcode.toDataURL(secret.otpauth_url);
  
      res.send(`
        <h2>Scan this QR Code in Google Authenticator</h2>
        <img src="${qrDataUrl}" alt="QR Code" />
        <form method="POST" action="/auth/2fa/verify">
          <input name="token" placeholder="Enter 2FA token" required />
          <button type="submit">Verify</button>
        </form>
      `);
    } catch (error) {
      console.error('Error generating 2FA:', error);
      res.status(500).send('Error generating 2FA QR code');
    }
  }
 
 
  async function verify2FA(req, res) {
    try {
      const { token } = req.body;
      const secret = req.session.twoFASecret;
  
      if (!secret) {
        return res.status(400).send('2FA secret not found in session');
      }
  
      const verified = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token
      });
  
      if (verified) {
        req.session.twoFA = true;
        return res.redirect('/auth/dashboard');
      }
  
      res.send('<h3>Invalid token. <a href="/auth/2fa/setup">Try Again</a></h3>');
    } catch (error) {
      console.error('Error verifying 2FA:', error);
      res.status(500).send('2FA verification failed');
    }
  }

function otpLogin(req, res) {
    const phoneNumber = req.body.phoneNumber;

    if (!phoneNumber) {
        return res.status(400).send('Phone number is required');
    }

    const otp = generateOtp();
    otpStorage[phoneNumber] = otp;

    sendOtp(phoneNumber, otp);

    res.status(200).send('OTP sent!');
}

function otpVerify(req, res) {
    const { phoneNumber, otp } = req.body;

    if (!otpStorage[phoneNumber] || otpStorage[phoneNumber] !== parseInt(otp)) {
        return res.status(400).send('Invalid OTP');
    }

    delete otpStorage[phoneNumber];  

    res.status(200).send('OTP verified successfully!  WELCOME TO MEMORIAL GO');
}

module.exports = { otpLogin, otpVerify, verify2FA,generate2FA };