import { Router } from "express";
const router = Router();
import { userData } from "../data/index.js";
import { createClient } from "redis";

const client = createClient();
client.connect().then(() => {});

router.route("/register").post(async (req, res) => {
  const createUserData = req.body;
  if (!createUserData || Object.keys(createUserData).length === 0) {
    return res
      .status(400)
      .json({ error: "Error: Must enter data for the fields" });
  }
  let name = createUserData.displayName;
  let email = createUserData.email;
  console.log(createUserData);
  let publicPlaylist = createUserData.public;
  let type = createUserData.accountType;
  let result = undefined;
  try {
    result = await userData.registerUser(
      name,
      email,
      publicPlaylist,
      type
    );
  } catch (e) {
    return res.status(400).json({ error: "Error: " + e });
  }
  await client.del(`userexist/${email}`);
  return res.status(200).json(result);
});

router.route("/account").get(async (req, res) => {
  const email = req.query.email;
  let exists = await client.exists(`account/${email}`);
  if (exists) {
    let result = await client.get(`account/${email}`);
    return res.status(200).json(JSON.parse(result));
  } else {
    let result = undefined;
    try {
      result = await userData.getAccount(email);
    } catch (e) {
      return res.status(400).json({ error: "Error: " + e });
    }
    await client.SETEX(`account/${email}`, 3600, JSON.stringify(result));
    return res.status(200).json(result);
  }
});

router.route("/profile").get(async (req, res) => {
  const id = req.query.userId;
  let result = undefined;
    try {
      result = await userData.getUserById(id);
    } catch (e) {
      return res.status(e.code).json({ error: "Error: " + e.error });
    }
    return res.status(200).json(result);
});

router.route("/userexist").get(async (req, res) => {
  const email = req.query.email;
  let exists = await client.exists(`userexist/${email}`);
  if (exists) {
    let result = await client.get(`userexist/${email}`);
    return res.status(200).json(JSON.parse(result));
  } else {
    try {
      const result = await userData.userExist(email);
      await client.SETEX(`userexist/${email}`, 3600, JSON.stringify(result));
      return res.status(200).json(result);
    } catch (e) {
      return res.status(400).json({ error: "Error: " + e });
    }
  }
});

router.route("/follow").patch(async (req, res) => {
  const followData = req.body;
  if (!followData || Object.keys(followData).length === 0) {
    return res
      .status(400)
      .json({ error: "Error: Must press the follow button" });
  }
  let email = followData.email;
  let id =  followData.followId;
  let result = undefined;
  try {
    result = await userData.followUser(
      email, id
    );
  } catch (e) {
    return res.status(400).json({ error: "Error: " + e });
  }
  await client.del(`account/${email}`);
  return res.status(200).json(result);
})

router.route("/unfollow").patch(async (req, res) => {
  const followData = req.body;
  if (!followData || Object.keys(followData).length === 0) {
    return res
      .status(400)
      .json({ error: "Error: Must press the unfollow button" });
  }
  let email = followData.email;
  let id =  followData.unfollowId;
  let result = undefined;
  try {
    result = await userData.unfollowUser(
      email, id
    );
  } catch (e) {
    return res.status(400).json({ error: "Error: " + e });
  }
  await client.del(`account/${email}`);
  return res.status(200).json(result);
})
router.route("/setpublic").patch(async (req, res) => {
  const publicData = req.body;
  if (!publicData || Object.keys(publicData).length === 0) {
    return res
      .status(400)
      .json({ error: "Error: Must press the set public button" });
  }
  let email = publicData.email;
  let result = undefined;
  try {
    result = await userData.setUserPublic(
      email
    );
  } catch (e) {
    return res.status(e.code).json({ error: "Error: " + e.error });
  }
  await client.del(`account/${email}`);
  return res.status(200).json(result);
})
router.route("/setprivate").patch(async (req, res) => {
  const publicData = req.body;
  if (!publicData || Object.keys(publicData).length === 0) {
    return res
      .status(400)
      .json({ error: "Error: Must press the set public button" });
  }
  let email = publicData.email;
  let result = undefined;
  try {
    result = await userData.setUserPrivate(
      email
    );
  } catch (e) {
    return res.status(400).json({ error: "Error: " + e });
  }
  await client.del(`account/${email}`);
  return res.status(200).json(result);
})
export default router;
