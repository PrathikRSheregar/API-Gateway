const express = require('express');
const router = express.Router();
const userRouter=require('./user-routes');
const infoRoutes = require('./info');
const {AuthRequestMiddlewares}=require('../../middlewares')

router.use('/info',infoRoutes);
router.use('/user',userRouter);
module.exports = router;