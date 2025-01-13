import express from 'express';
const router = express.Router();
import { authenticateUser } from '../controllers/auth.js';
import { createSong,deleteSongById,searchSongs,getAllSongs,getSongById,getSongsByGenre } from '../controllers/songs.controller.js';

router.post('/',authenticateUser,createSong)
router.get('/',getAllSongs);
router.get('/genres/:genre',getSongsByGenre);
router.get('/search',searchSongs);
router.get('/:id',getSongById);
router.delete('/:id',authenticateUser,deleteSongById);

export default router