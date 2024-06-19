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
      // findAndDeleteMany(ids, callback) {
      //   let deleted = [];
      //   ids.forEach((id) => {
      //     this.findByIdAndDelete(id, (err, result) => {
      //       if (!err) {
      //         console.log("result", result);
      //         deleted.push(result);
      //       }
      //     });
      //   });
      //   console.log("schema:: deleted", deleted);
      //   return deleted;
      // },
    },
  }
);

todoSchema.index({ index: 1 });
const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
