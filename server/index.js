require("dotenv").config();
const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");

const Todo = require("./schema");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.set("strictQuery", true);
mongoose.connect(process.env.DB_ATLAS);

app.get("/", (req, res) => {
  res.redirect("/todos");
});

app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.findSorted({});
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.json(err);
  }
});

app.get("/todos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findById(id);
    res.json(todo);
  } catch (err) {
    console.error(err);
    res.json({ error: `Error getting todo with id: ${id}` });
  }
});

// save a new todo
app.post("/todos", async (req, res) => {
  const { content, index = -1 } = req.body;
  try {
    const newTodo = await Todo.create({ completed: false, content, index });
    res.json(newTodo);
  } catch (err) {
    console.error(err);
    res.json({ error: `Error creating new todo.` });
  }
});

// update a todo's status
app.patch("/todos/:id", async (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;

  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: id },
      { completed },
      { returnOriginal: false }
    );
    res.json(todo);
  } catch (err) {
    console.error(err);
    res.json({ error: `Error updating todo with id: ${id}.` });
  }
});

// updates the index of given todos
app.patch("/todos", async (req, res) => {
  const { data: items } = req.body;
  // create a "promise" for each item to be updated
  const updates = items.map((item) =>
    Todo.findByIdAndUpdate(item.id, { index: item.index })
  );

  try {
    await Promise.all(updates);
    res.json(await Todo.findSorted({}));
  } catch (err) {
    console.error(err);
    res.json({ error: `Error updating todos with ids: ${items}.` });
  }
});

// deletes an item and returns collection (without the removed item)
// updates next items indexes
app.delete("/todos/:id", async (req, res) => {
  const { id: idToDelete } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const deleted = await Todo.findByIdAndDelete(idToDelete, {
      session,
    });
    await Todo.updateMany(
      { index: { $gt: deleted.index } },
      { $inc: { $index: -1 } },
      { session }
    );

    await session.commitTransaction();
    res.json(await Todo.findSorted({}));
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    res.json({ error: `Error deleting todo with id: ${idToDelete}.` });
  } finally {
    session.endSession();
  }
});

//deletes items with the ids specified in array [id1, id2, ...]
app.delete("/todos/", async (req, res) => {
  const { ids: idsToDelete } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // get the items to delete
    const itemsToDelete = await Todo.find({
      _id: { $in: idsToDelete },
    }).session(session);

    if (itemsToDelete.length === 0) {
      res.json({ error: "No items to delete." });
    }

    // delete the items
    await Todo.deleteMany({ _id: { $in: idsToDelete } }, { session: session });

    // get the lowest index of the deleted items
    const firstIndex = Math.min(...itemsToDelete.map((item) => item.index));
    // update items that have a greater index greater that the first deleted item
    await Todo.updateMany(
      {
        index: { $gt: firstIndex },
        _id: { $nin: idsToDelete },
      },
      { $inc: { index: -1 } },
      { session: session }
    );
    await session.commitTransaction();

    res.json(await Todo.findSorted({}));
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    res.json({ error: `Error deleting todos with ids: ${idsToDelete}` });
  }
});

app.listen(5000, () => {
  console.log("Server is listening on port 5000.");
});
