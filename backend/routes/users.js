import {Router} from 'express';
const router = Router();
router
  .route('/register')
  .post(async (req, res) => {
    return res.status(200)
})
export default router;