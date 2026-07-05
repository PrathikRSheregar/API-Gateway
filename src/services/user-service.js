const {UserRepository,RoleRepository} = require('../repositories');
const AppError=require('../utils/errors')
const {user,roles} = require('../models')
const userRepo = new UserRepository();
const roleRepo = new RoleRepository();
const { StatusCodes } = require('http-status-codes');
const {Auth} = require('../utils/common');
const {ServerConfig}=require('../config');
const jwt = require('jsonwebtoken');
const {ENUM}=require('../utils/common');
async function create(data){
    try { 
        const user = await userRepo.create(data);
        const role = await roleRepo.getRoleByName(ENUM.USER_ROLES_ENUMS.CUSTOMER);
        user.addRole(role);
        return user;
    } catch (error) {
        if(error.name === 'SequelizeUniqueConstraintError'|| error.name === 'SequelizeValidationError')
        {
            let explanation=[];
            error.errors.forEach((err)=>{
                explanation.push(err.message);
            });
            throw new AppError(explanation,StatusCodes.BAD_REQUEST);
        }   
        throw new AppError('Cannot create a new user object',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function signin(data) {
    try {
        const user = await userRepo.getUserByEmail(data.email);
        if(!user){
            throw new AppError('No user found for the given email',StatusCodes.NOT_FOUND);
        }
        const passwordMatch = Auth.checkPassword(data.password,user.password);
        if(!passwordMatch){
            throw new AppError('incorrect Password',StatusCodes.NOT_FOUND);
        }
        const roles = await user.getRoles();
        const jwt = Auth.createToken({
            id: user.id,
            email: user.email,
            roles: roles.map(role => role.name)
        });
        return jwt;
    } catch (error) {
        if(error instanceof AppError) throw error;
        throw new AppError(
            'Something went wrong',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function authenticate(token) {
    try{
        if(!token){
            throw new AppError('Missing JWT token',StatusCodes.BAD_REQUEST)
        }
        const decoded = jwt.verify(token, ServerConfig.JWT_SECRET);
        const user = await userRepo.get(decoded.id);
        if(!user)
        {
            throw new AppError('No User found', StatusCodes.NOT_FOUND);
        }
        return user;
    }catch(error){
        if(error instanceof AppError) throw error;
        if(error.name === 'JsonWebTokenError'){
            throw new AppError('Invalid JWT Token', StatusCodes.BAD_REQUEST);
        }
        if(error.name === 'TokenExpiredError'){
            throw new AppError('JWT Token expired',StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function addRoletoUser(data) {
    try {
        const user = await userRepo.get(data.id);
        if(!user)
        {
            throw new AppError('No User found for given id', StatusCodes.NOT_FOUND);
        }
        const role = await roleRepo.getRoleByName(data.role);
        if(!role)
        {
            throw new AppError('Invalid role', StatusCodes.NOT_FOUND);
        }
        user.addRole(role);
        return role;
    } catch (error) {
        if(error instanceof AppError) throw error;
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAdmin(id) {
     try {
        const user = await userRepo.get(id);
        if(!user)
        {
            throw new AppError('No User found for given id', StatusCodes.NOT_FOUND);
        }
        const adminrole = await roleRepo.getRoleByName(ENUM.USER_ROLES_ENUMS.ADMIN);
        return user.hasRole(adminrole);
    } catch (error) {
        if(error instanceof AppError) throw error;
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports={
    create,
    signin,
    authenticate,
    addRoletoUser,
    isAdmin
}