const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    completed: Boolean,
    content: String,
    index: Number,
  },
  {
    statics: {
      /* Returns all the documents matching the filter, ordered by their index. */
      findSorted(filter) {
        return this.find(filter).sort("index");
      },
    },
  }
);

todoSchema.index({ index: 1 });
const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
