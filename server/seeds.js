const mongoose = require("mongoose");
const Todo = require("./schema");

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/todoDB");

Todo.insertMany([
  {
    completed: true,
    content: "Complete online JavaScript course",
    index: 0,
  },
  {
    completed: false,
    content: "Jog around the park 3x",
    index: 1,
  },
  {
    completed: false,
    content: "10 minutes meditation",
    index: 2,
  },
  {
    completed: false,
    content: "Read for 1 hour",
    index: 3,
  },
  {
    completed: false,
    content: "Pick up groceries",
    index: 4,
  },
  {
    completed: false,
    content: "Complete Todo App on Frontend Mentor",
    index: 5,
  },
])
  .then((res) => {
    console.log("InsertMany Successfull");
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

//   db.todos.createIndex({index: 1});
