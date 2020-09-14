import { Router } from 'express';
import { Segments, celebrate, Joi } from 'celebrate';

import userController from './controllers/UserController';
import apiController from './controllers/ApiController';

const ApiController = new apiController();
const UserController = new userController();

const router = Router();

router.get('/users', UserController.index);

router.post('/users', celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required().error(new Error("name required")),
        email: Joi.string().required().error(new Error("email required")),
        password: Joi.string().required().error(new Error("password required")),
        confirmPassword: Joi.string().required().error(new Error("confirm password required")),
    })
}), UserController.create);

router.post('/users/login', celebrate({
    [Segments.BODY]: Joi.object({
        email: Joi.string().required().error(new Error("email required")),
        password: Joi.string().required().error(new Error("password required")),
    })
}), UserController.login);

// ------------------------------------------------------------ //

router.get('/apis', ApiController.index);

export default router;