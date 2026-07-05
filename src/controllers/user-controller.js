const { StatusCodes } = require('http-status-codes');
const {UserService} = require('../services');
const { errorResponse, successResponse } = require('../utils/common');

async function signup(req, res) {
    try {
        const user = await UserService.create({
            email: req.body.email,
            password: req.body.password
        });
        successResponse.message='Successfully created an user';
        successResponse.data=user;

        return res
            .status(StatusCodes.OK)
            .json(successResponse);

    } catch (error) {
        errorResponse.error=error
        return res
        .status(error.StatusCodes)
        .json(errorResponse);
    }
}

async function signin(req, res) {
    try {
        const user = await UserService.signin({
            email: req.body.email,
            password: req.body.password
        });
        successResponse.message='Successfully validated an user , create jwt corresponding to user';
        successResponse.data=user;

        return res
            .status(StatusCodes.OK)
            .json(successResponse);

    } catch (error) {
        errorResponse.error=error
        return res
        .status(error.StatusCodes)
        .json(errorResponse);
    }
}

async function addRoletoUser(req, res) {
    try {
        const user = await UserService.addRoletoUser({
            role: req.body.role,
            id: req.body.id
        });

        successResponse.data=user;
        return res
            .status(StatusCodes.OK)
            .json(successResponse);

    } catch (error) {
        errorResponse.error=error
        return res
        .status(error.StatusCodes)
        .json(errorResponse);
    }
}

module.exports={
    signup,
    signin,
    addRoletoUser
}