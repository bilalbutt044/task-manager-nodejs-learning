const express = require("express");
const auth = require("../middleware/auth");
const route = express.Router();
const Task = require("../models/task");

route.post("/tasks", auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id,
    });
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

route.get("/tasks", auth, async (req, res) => {
  const match = {};

  if (req.query.completed) match.completed = req.query.completed === "true";

  try {
    await req.user.populate({
      path: "tasks",
      match,
    });
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

route.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) return res.status(404).send();

    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

route.patch("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) return res.status(400).send({ error: "Invalid Updates" });

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) return res.status(404).send();

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});
route.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findByIdAndDelete(
      { _id, owner: req.user._id },
      { new: true }
    );
    if (!task) return res.status(400).send(" Task not found");

    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = route;
