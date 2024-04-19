import {Router} from 'express';
const router = Router();
import {userData} from '../data/index.js';
router
  .route('/register')
  .post(async (req, res) => {
    const createUserData = req.body;
    if (!createUserData || Object.keys(createUserData).length === 0) {
      return res
        .status(400)
        .json({error: "Error: Must enter data for the fields"})
    }
    let name = createUserData.displayName;
    let email = createUserData.email;
    let image = createUserData.image;
    let publicPlaylist = createUserData.public;
    let result = undefined;
    try{
        result = await userData.registerUser(name, email, image, publicPlaylist);
      }catch(e){
        return res.status(400).json({error: "Error: " + e});
      }
    return res.status(200).json(result);
})
router
  .route('/account')
  .get(async (req, res) => {
    const email = req.query.email;
    let result = undefined;
    try{
        result = await userData.getAccount(email);
    }catch(e){
        return res.status(400).json({error: "Error: " + e});
    }
    return res.status(200).json(result);
})
export default router;