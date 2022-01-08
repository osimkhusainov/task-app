const express = require("express");
const User = require("./../models/user");
const auth = require("./../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const {
  sendWelkomeMail,
  sendUpdateEmail,
  sendDeleteEmail,
} = require("../emails/accounts");
const router = new express.Router();
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload Jpg, Jpeg or Png files"));
    }
    cb(undefined, true);
  },
});

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    sendWelkomeMail(user.email, user.name);
    const token = await user.generateToken();
    res.status(201).send({ user, token });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateToken();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send({ success: "Logout" });
  } catch (e) {
    res.status(500).send({ error: "Server error" });
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send({ success: "Logout all" });
  } catch (e) {
    res.status(500).send({ error: "Server error" });
  }
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    try {
      req.user.avatar = buffer;
      await req.user.save();
      res.send({ success: "Success!" });
    } catch (e) {
      res.status(500).send({ error: "Server error" });
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error("User not found");
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

router.get("/users", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/users/me", auth, async (req, res) => {
  console.log(req.user);
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "age", "password"];
  const isValidParam = updates.every((param) => allowedUpdates.includes(param));
  try {
    if (!isValidParam) {
      return res.status(400).send({ error: "Bad params" });
    }
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    sendUpdateEmail(req.user.email, updates);
    res.send(req.user);
  } catch (e) {
    res.status(400).send({ error: "Wrong params" });
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendDeleteEmail(req.user.email, req.user.name);
    res.status(200).send({ user: req.user, status: "Deleted" });
  } catch (e) {
    res.status(500).send({ error: "Error" });
  }
});

router.delete("/users/me/avatar", auth, async (req, res) => {
  const avatar = (req.user.avatar = undefined);
  try {
    if (!avatar) {
      return res.send({ status: "Image not found" });
    }
    await req.user.save();
    res.send({ status: "Deleted" });
  } catch (e) {
    res.status(500).send({ error: "Internal server error" });
  }
});

module.exports = router;
