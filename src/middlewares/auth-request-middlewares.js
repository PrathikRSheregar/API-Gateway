const { errorResponse } = require('../utils/common');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors');
const { UserService } = require('../services');
const { message } = require('../utils/common/error-response');

function validateAuthRequest(req, res, next) {
    if (!req.body.email) {
        errorResponse.message = 'Something went wrong while authenticating user';
        errorResponse.error = new AppError(
            ['Email not found on the incoming request'],
            StatusCodes.BAD_REQUEST
        );

        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(errorResponse);
    }

    if (!req.body.password) {
        errorResponse.message = 'Something went wrong while authenticating user';
        errorResponse.error = new AppError(
            ['Password not found on the incoming request'],
            StatusCodes.BAD_REQUEST
        );

        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(errorResponse);
    }

    next();
}

async function authenticate(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        const user = await UserService.authenticate(token);

        req.user = user;

        return next();
    } catch (error) {
        errorResponse.message = error.message;
        errorResponse.error = error;

        return res
            .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
            .json(errorResponse);
    }
}
async function isAdmin(req,res,next){
    const response = await UserService.isAdmin(req.user.dataValues.id)
    if(!response){
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({message:'User not authorized for this action'});
    }
    next();
}


module.exports = {
    validateAuthRequest,
    authenticate,
    isAdmin,
};