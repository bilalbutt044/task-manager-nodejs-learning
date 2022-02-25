const express = require("express");
const route = express.Router();
const User = require("../models/user");

route.get("/users", (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((e) => res.status(500).send(e));
});
route.get("/users/:id", (req, res) => {
  const _id = req.params.id;

  User.findById({ _id })
    .then((user) => {
      if (!user) {
        return res.status(400).send();
      }
      res.send(user);
    })
    .catch((err) => res.status(500).send(err));
});

route.patch("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findByIdAndUpdate({ _id }, req.body, { new: true });
    if (!user) return res.status(400).send(" user not found");

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});
route.delete("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findByIdAndDelete({ _id }, { new: true });
    if (!user) return res.status(400).send(" user not found");

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

route.post("/users", (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => {
      res.status(201).send(user);
    })
    .catch((err) => res.status(400).send(err));
});

module.exports = route;
