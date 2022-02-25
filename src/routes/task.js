const express = require("express");
const route = express.Router();
const Task = require("../models/task");

route.post("/tasks", (req, res) => {
  const task = new Task(req.body);

  task
    .save()
    .then(() => {
      res.status(201).send(task);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

route.get("/tasks", (req, res) => {
  Task.find({})
    .then((tasks) => res.send(tasks))
    .catch((e) => e.status(500).send(e));
});
route.get("/tasks/:id", (req, res) => {
  const _id = req.params.id;
  Task.find({ _id })
    .then((tasks) => {
      if (!tasks) return res.status(400).send();

      res.send(tasks);
    })
    .catch((e) => e.status(500).send(e));
});

route.patch("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findByIdAndUpdate({ _id }, req.body, { new: true });
    if (!task) return res.status(400).send(" Task not found");

    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});
route.delete("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findByIdAndDelete({ _id }, { new: true });
    if (!task) return res.status(400).send(" Task not found");

    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = route;
