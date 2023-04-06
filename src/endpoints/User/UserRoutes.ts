import {Router} from 'express';
const router:Router = Router();
import UserController from './UserController';

router.get('/', UserController.getAllUsers);
router.post('/auth/register', UserController.register);
router.post('/auth/login', UserController.login);
router.get('/login', UserController.login);
router.get('/:username', UserController.getUserByUsername);
router.put('/:username/update', UserController.updateUser);
router.delete('/:username/delete', UserController.deleteUser);


export default router;