import {Router} from 'express';
const router = Router();
import {userData} from '../data/index.js';
router
  .route('/register')
  .post(async (req, res) => {
    return res.status(200)
})
router
  .route('/account')
  .get(async (req, res) => {
    return res.status(200)
})
export default router;