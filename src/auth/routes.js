"use strict";
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("./models/users-model.js");
const basicAuth = require("./middleware/basic.js");
const bearerAuth = require("./middleware/bearer.js");
const Dashboard = require("./models/dashboard-model.js");
const acl = require("../auth/middleware/acl.js");
const { token } = require("morgan");

router.get("/", (req, res) => {
  res.render("pages/home");
});

router.get("/signup", (req, res) => {
  res.render("pages/register");
});
router.post("/signup", async (req, res, next) => {
  console.log("0", req.body);
  let obj;
  try {
    let user = new User(req.body);
    console.log("1", user);
    const userRecord = await user.save();
    console.log("2", userRecord);
    const output = {
      user: userRecord,
      token: userRecord.token,
    };
    obj = {
      username: output.user.username,
      state: "You Successfully Signed Up",
    };
    if (output.user.rate.length === 0) {
      res.status(201).json(obj);
      // res.status(201).redirect('/profile');
    }
    if (output.user.rate.length > 0) {
      let average = (array) => array.reduce((a, b) => a + b) / array.length;
      userRecord.rate = Math.round(average(userRecord.rate) * 10) / 10;
      res.status(201).json(obj);
      // res.status(201).redirect('/profile');
    }
  } catch (e) {
    console.log(e);
    next(e.message);
  }
});

router.get("/signin", (req, res) => {
  res.render("pages/signin");
});
router.post("/signin", basicAuth, (req, res, next) => {
  console.log("/signin_back");
  try {
    const user = {
      username: req.user.username,
      dashboard: req.user.dashboard,
      descriptionOfUser: req.user.descriptionOfUser,
      email: req.user.email,
      experience: req.user.experience,
      name: req.user.name,
      notifications: req.user.notifications,
      profileCover: req.user.profileCover,
      profilePicture: req.user.profilePicture,
      role: req.user.role,
      service: req.user.service,
      _id: req.user._id,
      token: req.user.token,
    };
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    console.log("error");
    next(error.message);
  }

  // res.status(200).redirect('/profile');
});

router.get("/users", bearerAuth, async (req, res, next) => {
  //all users
  try {
    const users = await User.find({});
    const list = users.map((user) => user.username);
    res.status(200).json(list);
  } catch (error) {
    next(error.message);
  }

  //one user
  // await res.status(200).json({user : req.user.username});
});

router.post("/posts", bearerAuth, async (req, res, next) => {
  console.log("id from posts", req.user.id);
  try {
    let dashboard = new Dashboard(req.body);
    const dashboardRecord = await dashboard.save();
    let id = req.user.id;

    const userDashboard = await User.findByIdAndUpdate(
      id,
      {
        $push: {
          dashboard: {
            serviceNeeded: req.body.serviceNeeded,
            date: req.body.date,
            text: req.body.text,
          },
        },
      },
      { new: true }
    );
    res.status(201).json([dashboardRecord, userDashboard.dashboard]);
  } catch (e) {
    next(e.message);
  }
});
router.get("/dashboard", async (req, res, next) => {
  //dashboard
  try {
    const dashboard = await Dashboard.find({});
    res.status(200).json(dashboard);
  } catch (error) {
    next(error.message);
  }
});

//******************************************************** */

router.get("/profile", bearerAuth, async (req, res, next) => {
  console.log(req.user);
  try {
    let obj = {
      username: req.user.username,
      rate: req.user.rate,
      role: req.user.role,
      id: req.user._id,
      messages: req.user.messages,
      dashboard: req.user.dashboard,
      notifications: req.user.notifications,
    };

    // await res.status(200).json({user : req.user});
    await res.status(200).json(obj);
  } catch (error) {
    next(error.message);
  }
});

router.put("/profile", bearerAuth, acl("update"), async (req, res, next) => {
  try {
    let id = req.user.id;
    let updateEntry = await User.findByIdAndUpdate(id, req.body, { new: true });
    console.log(updateEntry);
    let obj = {
      name: updateEntry.name,
      service: updateEntry.service,
      experience: updateEntry.experience,
      descriptionOfUser: updateEntry.descriptionOfUser,
    };
    res.status(200).json(obj);
  } catch (error) {
    next(error.message);
  }
});

router.delete("/delete", bearerAuth, async (req, res, next) => {
  try {
    let id = req.body.id;
    let deletedObject = await Dashboard.findByIdAndDelete(id);
    res.status(204).json(`the record of this ${id} is deleted successfully `);
  } catch (error) {
    next(error.message);
  }
});

router.get("/notifications", bearerAuth, async (req, res, next) => {
  try {
    let id = req.user.id;
    let object = await User.findById(id);
    let notificationsUsers = object.notifications.map((elm) => {
      if (elm.username) {
        return elm.username;
      } else {
        return "John";
      }
    });
    res
      .status(200)
      .json({
        numberOfNotifications: object.notifications.length,
        notificationsFrom: notificationsUsers,
        notifications: object.notifications,
      });
  } catch (error) {
    next(error.message);
  }
});

/******************************************************************************* */

const Message = require("./models/Message");

//add

router.post("/messages", async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get

router.get("/messages/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

const Conversation = require("./models/Conversation");

//new conv

router.post("/conversations", async (req, res) => {
  const ifThere = await Conversation.find({
    members: { $in: [req.body.senderId] },
  });
  let data = [];
  ifThere.forEach((obj) => {
    obj.members.forEach((a) => {
      data.includes(a) ? null : data.push(a);
    });
  });

  console.log("new", ifThere);
  console.log(
    "data.includes(req.body.receiverId)",
    data.includes(req.body.receiverId)
  );
  if (data.includes(req.body.receiverId)) {
    res.status(200).json("There is a chat");
  } else {
    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
    });

    try {
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

router.get("/conversations/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conv includes two userId

router.get(
  "/conversations/find/:firstUserId/:secondUserId",
  async (req, res) => {
    try {
      const conversation = await Conversation.findOne({
        members: { $all: [req.params.firstUserId, req.params.secondUserId] },
      });
      res.status(200).json(conversation);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

/***************************************** */
const Post = require("./models/Post");

//create a post

router.post("/posts/upload", async (req, res) => {
  console.log("req_post", req.body);
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a post

router.put("posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//delete a post

router.delete("posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//like / dislike a post

router.put("posts/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//get a post

router.get("posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get timeline posts

router.get("/posts/timeline", async (req, res) => {
  try {
    const allPosts = await Post.find();
    res.status(200).json(allPosts);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user's all posts

router.get("/posts/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

//**************get user */
router.get("/users/:userId", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    // console.log('/users/:userId', user);
    res.status(200).json(user);
  } catch (error) {
    next(error.message);
  }
});
router.get("/user/profile/:username", async (req, res, next) => {
  console.log("/users/:username", req.params.username);
  try {
    const user = await User.find({ username: req.params.username });
    res.status(200).json(user);
  } catch (error) {
    next(error.message);
  }
});

// ************************************************************** //

router.put("/notif", async (req, res, next) => {
  const saveNotification = async () => {
    const user = await User.findById(req.body.userId);
    console.log(user.notifications);
    let deletedNotif = user.notifications;
    deletedNotif.splice(req.body.index);
    await User.findByIdAndUpdate(req.body.userId, {
      $set: { notifications: deletedNotif },
    });
  };
  saveNotification();
});

/*************** */
router.put("/posts/:postId", async (req, res, next) => {
  console.log('routes/429', req.params.postId, req.body);
  await Post.findByIdAndUpdate(req.params.postId, { $set: { desc: req.body.newDesc } });
});

router.delete("/posts/:postId", async (req, res, next) => {
  await Post.findByIdAndDelete(req.params.postId);
});

module.exports = router;
