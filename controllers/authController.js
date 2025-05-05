const { sendOtp, generateOtp } = require('../services/otpService');

const otpStorage = {};

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

module.exports = { otpLogin, otpVerify };
