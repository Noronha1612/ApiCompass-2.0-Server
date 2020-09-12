import { Router } from 'express';

import userController from './controllers/UserController';
import apiController from './controllers/ApiController';

const ApiController = new apiController();
const UserController = new userController();

const router = Router();

router.get('/users', UserController.index);

// ------------------------------------------------------------ //

router.get('/apis', ApiController.index);

export default router;