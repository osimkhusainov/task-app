const express = require("express");
const auth = require("../middleware/auth");
const Task = require("./../models/task");

const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  // const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};
  // match.completed = req.query.completed && req.query.completed === "true";
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }
  if (req.query.sortBy) {
    const [name, val] = req.query.sortBy.split(":");
    sort[name] = val === "desc" ? -1 : 1;
  }
  try {
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      },
    });
    if (req.user.tasks.length === 0) {
      return res.send({ status: "Tasks not founed" });
    }
    res.send(req.user.tasks);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send({ error: "Task not founed" });
    }

    res.send(task);
  } catch (e) {
    res.status(500).send({ error: "Server error" });
  }
});

//put

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidParam = updates.every((param) => allowedUpdates.includes(param));
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send({ error: "Task not founed" });
    }
    if (!isValidParam) {
      return res.status(400).send({ error: "Invalid params" });
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400).send({ error: "Wrong params" });
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  console.log(_id);
  console.log(req.user_id);
  try {
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send({ error: "Task not founed" });
    }
    res.send({ status: "Deleted" });
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
