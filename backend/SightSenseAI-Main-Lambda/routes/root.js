import express from 'express';
import { getImageMetaData, doRekognition } from '../controllers/root.js';

const router = express.Router();

router.post('/do-rekognition', doRekognition);
router.get('/get-image-metadata', getImageMetaData);

export default router;
