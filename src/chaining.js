const mongoose = require("mongoose");
require("./db/mongoose");

const Task = require("./models/task");

// Task.findByIdAndDelete("620ce731f13dbfe2b14424ec")
//   .then((res) => {
//     console.log("res", res);
//     return Task.countDocuments({ completed: false });
//   })
//   .then((doc) => console.log("total uncomplete docs", doc))
//   .catch((e) => console.log(e));

const findAndDelete = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({ completed: false });
  return count;
};

findAndDelete("620d034479a0eea670d93866")
  .then((c) => console.log("total", c))
  .catch((e) => console.log(e));
