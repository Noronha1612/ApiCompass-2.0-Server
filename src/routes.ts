import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import userController from './controllers/UserController';
import apiController from './controllers/ApiController';

const router = Router();

const ApiController = new apiController();
const UserController = new userController();

router.get('/users/:id', celebrate({
    params: Joi.object({
        id: Joi.string().required()
    })
}), UserController.index);

router.get('/users', UserController.indexAllUsers);

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

router.put('/users/password', celebrate({
    body: Joi.object({
        password: Joi.string().required(),
        confPassword: Joi.string().required()
    }),
    headers: Joi.object({
        useremail: Joi.string().required()
    }).options({ allowUnknown: true })
}), UserController.changePassword);

router.put('/users/follow', celebrate({
    headers: Joi.object({
        followedid: Joi.string().required(),
        userid: Joi.string().required()
    }).options({ allowUnknown: true })
}), UserController.follow);

router.put('/users/unfollow', celebrate({
    headers: Joi.object({
        followedid: Joi.string().required(),
        userid: Joi.string().required()
    }).options({ allowUnknown: true })
}), UserController.unfollow);

router.delete('/users/:userId', celebrate({
    params: Joi.object({
        userId: Joi.string().required()
    })
}), UserController.delete);

// ------------------------------------------------------------ //

router.get('/apis/all', ApiController.indexAllApis);

router.get('/apis', celebrate({
    headers: Joi.object({
        apiids: Joi.string().required()
    }).options({ allowUnknown: true })
}), ApiController.index);

export default router;