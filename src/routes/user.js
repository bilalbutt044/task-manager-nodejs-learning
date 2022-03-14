const express = require("express");
const auth = require("../middleware/auth");
const route = express.Router();
const User = require("../models/user");

route.get("/users/me", auth, (req, res) => {
  res.send(req.user);
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

  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) return res.status(400).send({ error: "Invalid Updates" });

  const user = await User.findById(_id);
  updates.forEach((update) => (user[update] = req.body[update]));
  await user.save();

  try {
    // const user = await User.findByIdAndUpdate({ _id }, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
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

route.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    const token = await user.generateAuthToken();
    await user.save();
    res.status(201).send({
      user,
      token,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

route.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({
      user,
      token,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = route;
