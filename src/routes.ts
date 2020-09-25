import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import userController from './controllers/UserController';
import apiController from './controllers/ApiController';

const router = Router();

const ApiController = new apiController();
const UserController = new userController();

router.get('/users', UserController.index);

router.post('/users', celebrate({
    body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        confirmPassword: Joi.string().required(),
    })
}), UserController.create);

router.post('/users/login', celebrate({
    body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
    })
}), UserController.login);

router.post('/users/sendMail', celebrate({
    query: Joi.object({
        userEmail: Joi.string().required(),
    })
}), UserController.sendCode);

// ------------------------------------------------------------ //

router.get('/apis', ApiController.index);

export default router;