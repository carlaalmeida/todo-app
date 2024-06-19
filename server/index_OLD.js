const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");

const Todo = require("./schema");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/todoDB");

app.get("/", (req, res) => {
  console.log("tenho de fazer redirect...");
  res.redirect("/todos");
});

app.get("/todos", (req, res) => {
  Todo.findSorted({})
    .then((todos) => {
      console.log("tenho todos para enviar...");
      console.dir(todos);
      res.json(todos);
    })
    .catch((err) => {
      console.error(err);
      res.json([]);
    });

  // Todo.findSorted({}, (err, todos) => {
  //   if (err) {
  //     console.error(err);
  //     res.json([]);
  //   } else {
  //     res.json(todos);
  //   }
  // }).sort({ index: 1 });
});

app.get("/todos/:id", (req, res) => {
  const id = req.params.id;

  Todo.findById(id)
    .then((todo) => res.json(todo))
    .catch((err) => {
      res.json(err);
    });
  // Todo.findById(id, (err, todo) => {
  //   if (err) {
  //     console.error(err);
  //     // TODO: handle error
  //     res.json({});
  //   } else if (todo) {
  //     res.json(todo);
  //     console.log(todo);
  //   } else {
  //     // object doesn't exist
  //     // TODO: handle error
  //     res.json({});
  //   }
  // });
});

// save a new todo
app.post("/todos", (req, res) => {
  const content = req.body.content;
  const index = req.body.index || -1;

  Todo.create({
    content: content,
    completed: false,
    index: index,
  })
    .then((todo) => res.json(todo))
    .catch((err) => {
      res.json(err);
    });

  // Todo.create(
  //   {
  //     content: content,
  //     completed: false,
  //     index: index,
  //   },
  //   (err, todo) => {
  //     if (err) {
  //       console.error(err);
  //     } else {
  //       res.json(todo);
  //     }
  //   }
  // );
});

// update a todo's status
app.patch("/todos/:id", (req, res) => {
  const id = req.params.id;
  const completed = req.body.completed;

  Todo.findOneAndUpdate(
    { _id: id },
    { completed: completed },
    { returnOriginal: false }
  )
    .then((todo) => res.json(todo))
    .catch((err) => {
      console.error(err);
      res.json({ error: err });
    });

  // Todo.findOneAndUpdate(
  //   { _id: id },
  //   { completed: completed },
  //   { returnOriginal: false },
  //   (err, todo) => {
  //     if (err) {
  //       console.error(err);
  //       res.json({ error: err });
  //     } else {
  //       res.json(todo);
  //     }
  //   }
  // );
});

// updates the index of given todos
app.patch("/todos", (req, res) => {
  const { data } = req.body;
  console.log(data);
  // create a "promise" for each item to be updated
  const updates = data.map((item) =>
    Todo.findByIdAndUpdate(item.id, { index: item.index })
  );

  Promise.all(updates)
    .then(() => Todo.findSorted({}))
    .then((todos) => res.json(todos))
    .catch((err) => {
      console.error(err);
      res.json({ error: err });
    });
  // updates.forEach((item) => {
  //   Todo.findByIdAndUpdate(item.id, { index: item.index }, (err, todo) => {
  //     if (err) {
  //       console.error(err);
  //       res.json({ error: err });
  //     }
  //     console.log(`atualizei o index do ${item.id}`);
  //   });
  // });

  // Todo.findSorted({}, (err, todos) => {
  //   if (err) {
  //     console.error(err);
  //     res.json({ error: err });
  //   } else {
  //     console.log("cheguei ao fim do findSorted");
  //     res.json(todos);
  //   }
  // });
});

// deletes an item and returns collection (without the removed item)
// updates next items indexes
app.delete("/todos/:id", (req, res) => {
  const idToDelete = req.params.id;

  Todo.findByIdAndDelete(idToDelete) // delete the item
    // Todo.findById(idToDelete)
    .then((deleted) => {
      // get all the items that have a greater index
      return Todo.findSorted({ index: { $gt: deleted.index } });
    })
    .then((todosToUpdate) => {
      // update their index
      const promises = todosToUpdate.map((todo) =>
        Todo.findByIdAndUpdate(todo._id, { $inc: { index: -1 } })
      );
      console.log("finished building updates");
      console.log(promises);
      return Promise.all(promises);
    })
    .then(() => {
      // get the all the todos
      return Todo.findSorted({});
    })
    .then((todos) => res.json(todos))
    .catch((err) => {
      console.error(err);
      res.json({ error: err });
    });

  // Todo.findByIdAndDelete(idToDelete, {}, (err, deleted) => {
  //   if (err) {
  //     console.error(err);
  //     res.json({ error: err });
  //   } else {
  //     //update the items at next indexes
  //     Todo.findSorted({ index: { $gt: deleted.index } }, (err, todos) => {
  //       console.log(todos);
  //       todos.forEach((item) => {
  //         Todo.findByIdAndUpdate(
  //           item._id,
  //           // { index: item.index - 1 },
  //           { $inc: { index: -1 } },
  //           (err, todo) => {
  //             if (err) {
  //               console.error(err);
  //             }
  //           }
  //         );
  //       });
  //     });

  //     Todo.findSorted({}, (err, todos) => {
  //       if (err) {
  //         console.error(err);
  //         res.json({ error: err });
  //       } else {
  //         res.json(todos);
  //       }
  //     });
  //   }
  // });
});

//deletes items with the ids specified in array [id1, id2, ...]
app.delete("/todos/", (req, res) => {
  if (req.body.ids) {
    const idsToDelete = req.body.ids;

    const deletes = idsToDelete.map((id) => Todo.findByIdAndDelete(id));

    Promise.all(deletes)
      .then((deletedTodos) => {
        const todosToUpdate = deletedTodos.map((deleted) =>
          Todo.findSorted({
            _id: { $nin: idsToDelete }, // ignoring removed todos
            index: { $gt: deleted.index },
          })
        );
        return Promise.all(todosToUpdate);
      })
      .then((result) => {
        // using flat() to flatten the results array before building the queries
        const updates = result
          .flat()
          .map((todo) =>
            Todo.findByIdAndUpdate(todo._id, { $inc: { index: -1 } })
          );
        return Promise.all(updates);
      })
      .then((result) => {
        return Todo.findSorted({});
      })
      .then((todos) => {
        return res.json(todos);
      })
      .catch((err) => {
        console.error(err);
        res.json({ error: err });
      });

    // get the todos/indexes to delete
    // delete each todo
    // update the index of next todos
    // return remaining todos updated

    // idsToDelete.forEach((id) => {
    //   Todo.findByIdAndDelete(id, {}, (err, deleted) => {
    //     console.log("**** we deleted this", deleted);
    //     if (err) {
    //       console.error(err);
    //     } else if (deleted) {
    //       Todo.findSorted({ index: { $gt: deleted.index } }, (err, todos) => {
    //         if (err) {
    //           console.error(err);
    //         } else {
    //           console.log("we need to update these:", todos);
    //           todos.forEach((nextTodo) => {
    //             Todo.findByIdAndUpdate(
    //               nextTodo._id,
    //               // { index: nextTodo.index - 1 },
    //               { $inc: { index: -1 } },
    //               (err, todo) => {
    //                 if (err) {
    //                   console.error(err);
    //                 } else {
    //                   console.log("updated todo", todo);
    //                 }
    //               }
    //             );
    //           });
    //         }
    //       });
    //     }
    //   });
    // });

    // Todo.find({ _id: { $in: idsToDelete } }, "index")
    //   .then((todosToDelete) => {
    //     // todosToDelete.forEach((todo) => {
    //     //   console.log("i want to delete you!", todo);
    //     //   Todo.findByIdAndDelete(todo._id);
    //     // });
    //     return Todo.deleteMany({ _id: { $in: idsToDelete } });
    //     console.log(todosToDelete);
    //   })
    //   .then((result) => {
    //     console.log("**** IDK**** ", result);
    //   });

    // Todo.findSorted({}, (err, todos) => {
    //   if (err) {
    //     console.error(err);
    //     res.json({ error: err });
    //   } else {
    //     // console.log(">>>> sending this", todos);
    //     res.json(todos);
    //   }
    // });
  }
});

app.listen(5000, () => {
  console.log("Server is listening on port 5000.");
});
