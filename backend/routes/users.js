import { Router } from "express";
const router = Router();
import { userData } from "../data/index.js";
import xss from "xss";
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
  let name = xss(createUserData.displayName);
  let email = xss(createUserData.email);
  console.log(createUserData);
  let publicPlaylist = xss(createUserData.public);
  let type = xss(createUserData.accountType);
  let password = xss(createUserData.password);
  let result = undefined;
  try {
    result = await userData.registerUser(
      name,
      email,
      createUserData.public,
      type,
      password
    );
  } catch (e) {
    return res.status(e.code).json({ error: "Error: " + e.error });
  }
  await client.del(`userexist/${email}`);
  return res.status(200).json(result);
});

router.route("/account").get(async (req, res) => {
  const email = xss(req.query.email);
  let exists = await client.exists(`account/${email}`);
  if (exists) {
    let result = await client.get(`account/${email}`);
    return res.status(200).json(JSON.parse(result));
  } else {
    let result = undefined;
    try {
      result = await userData.getAccount(email);
    } catch (e) {
      return res.status(e.code || 400).json({ error: "Error: " + e.error });
    }
    await client.SETEX(`account/${email}`, 3600, JSON.stringify(result));
    return res.status(200).json(result);
  }
});

router.route("/profile").get(async (req, res) => {
  const id = xss(req.query.userId);
  let result = undefined;
    try {
      result = await userData.getUserById(id);
    } catch (e) {
      return res.status(e.code || 400).json({ error: "Error: " + e.error });
    }
    return res.status(200).json(result);
});

router.route("/userexist").get(async (req, res) => {
  const email = xss(req.query.email);
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
      return res.status(500).json({ error: "Error: " + e });//this should always work, if not, must be mongo server error
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
  let email = xss(followData.email);
  let id =  xss(followData.followId);
  let result = undefined;
  try {
    result = await userData.followUser(
      email, id
    );
  } catch (e) {
    return res.status(e.code || 500).json({ error: "Error: " + e.error });
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
  let email = xss(followData.email);
  let id =  xss(followData.unfollowId);
  let result = undefined;
  try {
    result = await userData.unfollowUser(
      email, id
    );
  } catch (e) {
    return res.status(e.code || 500).json({ error: "Error: " + e.error });
  }
  await client.del(`account/${email}`);
  return res.status(200).json(result);
})
router.route("/save").patch(async (req, res) => {
  const saveData = req.body;
  if (!saveData || Object.keys(saveData).length === 0) {
    return res
      .status(400)
      .json({ error: "Error: Must press the save button" });
  }
  let email = xss(saveData.email);
  let id =  xss(saveData.saveId);
  let result = undefined;
  try {
    result = await userData.savePlaylist(
      email, id
    );
  } catch (e) {
    return res.status(e.code || 500).json({ error: "Error: " + e.error });
  }
  await client.del(`account/${email}`);
  return res.status(200).json(result);
})

router.route("/unsave").patch(async (req, res) => {
  const saveData = req.body;
  if (!saveData || Object.keys(saveData).length === 0) {
    return res
      .status(400)
      .json({ error: "Error: Must press the unsave button" });
  }
  let email = xss(saveData.email);
  let id =  xss(saveData.unsaveId);
  let result = undefined;
  try {
    result = await userData.unsavePlaylist(
      email, id
    );
  } catch (e) {
    return res.status(e.code || 500).json({ error: "Error: " + e.error });
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
  let email = xss(publicData.email);
  let result = undefined;
  try {
    result = await userData.setUserPublic(
      email
    );
    console.log(result)
  if (result && result.acknowledged) {
    await client.del("allplaylists");
    await client.del(`account/${email}`);
    return res.status(200).json({ message: "Profile set to public" });
  }
  } catch (e) {
    console.log(e)
    return res.status(e.code || 500).json({ error: "Error: " + e.error });
  }
  await client.del(`account/${email}`);
  console.log("deleted")
  return res.status(200).json(result);
})
router.route("/setprivate").patch(async (req, res) => {
  const publicData = req.body;
  if (!publicData || Object.keys(publicData).length === 0) {
    return res
      .status(400)
      .json({ error: "Error: Must press the set public button" });
  }
  let email = xss(publicData.email);
  let result = undefined;
  try {
    result = await userData.setUserPrivate(
      email
    );
    console.log(result)
    if (result && result.acknowledged) {
      await client.del("allplaylists");
      await client.del(`account/${email}`);
      console.log("passed")
      const keys = await client.keys("account*"); 
      !!keys.length && client.unlink(keys); 
      const newKeys = await client.keys("account*");
      return res.status(200).json({ message: "Profile set to private" });
    }
  } catch (e) {
    return res.status(e.code || 500).json({ error: "Error: " + e.error });
  }
  await client.del(`account/${email}`);
  console.log("passed")
  const keys = await client.keys("account*"); 
  !!keys.length && client.unlink(keys); 
  const newKeys = await client.keys("account*");
  return res.status(200).json(result);
})

router.route("/getfollowedusers").get(async (req, res) => {
  try {
    const ids = req.query.followedIds;
    for (let x of ids){
      x = xss(x);
    }
      const result = await userData.getFollowedUsers(ids);
      return res.status(200).json(result);
    } catch (e) {
      return res.status(e.code || 400).json({ error: "Error: " + e.message});
    }
});
router.route("/userStats").get(async (req, res) => {
  const email = xss(req.query.userEmail);
  let result = undefined;
  try {
    result = await userData.getUserStats(email);
  } catch (e) {
    return res.status(e.code || 400).json({ error: "Error: " + e.error });
  }
  return res.status(200).json(result);
});
export default router;
