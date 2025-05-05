
const client = require('../config/twilioconfig');


function sendOtp(phoneNumber, otp) {
    client.messages.create({
        body: `Your OTP is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER, 
        to: phoneNumber
    }).then(message => console.log(message.sid));
}


function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000);  
}

module.exports = { sendOtp, generateOtp };
