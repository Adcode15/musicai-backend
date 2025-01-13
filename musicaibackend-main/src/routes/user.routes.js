import express from 'express';
const router = express.Router();
import { userRegistration,userLogin } from '../controllers/user.controller.js';
import { authenticateUser } from '../controllers/auth.js';
// router.get('/user/:userId/songs', isLoggedIn,getUserSongs);

router.post('/login', userLogin);

router.post('/register', userRegistration);





export default router;