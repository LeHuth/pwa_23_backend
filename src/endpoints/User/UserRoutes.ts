import {Router} from 'express';
const router:Router = Router();
import UserController from './UserController';

router.get('/', UserController.getAllUsers);
router.post('/auth/register', UserController.register);
router.post('/auth/login', UserController.login);
router.get('/login', UserController.login);
router.get('/:username', UserController.getUserByUsername);
router.put('/:userName/update', UserController.placeholder);
router.delete('/:userName/delete', UserController.placeholder);


export default router;