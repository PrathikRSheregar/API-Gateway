require('dotenv').config();

const PORT = Number(process.env.PORT);
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY;
const FLIGHT_SERVICE=process.env.FLIGHT_SERVICE;
const BOOKING_SERVICE=process.env.BOOKING_SERVICE;


module.exports = {
    PORT,
    SALT_ROUNDS,
    JWT_SECRET,
    JWT_EXPIRY,
    FLIGHT_SERVICE,
    BOOKING_SERVICE
};