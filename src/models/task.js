const mongoose = require("mongoose");
const taskSchema = require("../Schema/taskSchema");

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
