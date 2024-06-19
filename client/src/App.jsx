import { useEffect } from "react";
import { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { CreateTodo } from "./components/CreateTodo";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { TodoList } from "./components/TodoList";
import axios from "axios";

function App() {
  // const initialItems = [
  //   { _id: "item-1", checked: true, text: "Complete online JavaScript course" },
  //   { _id: "todo-2", checked: false, text: "Jog around the park 3x" },
  //   { _id: "todo-3", checked: false, text: "10 minutes meditation" },
  //   { _id: "todo-4", checked: false, text: "Read for 1 hour" },
  //   { _id: "todo-5", checked: false, text: "Pick up groceries" },
  //   {
  //     _id: "todo-6",
  //     checked: false,
  //     text: "Complete Todo App on Frontend Mentor",
  //   },
  // ];
  const API_URL = "http://localhost:5000"; // Mudar isto para IP atual da API

  const [mode, setMode] = useState(null);

  const [items, setItems] = useState([]);
  const [prevItems, setPrevItems] = useState(null);

  // save previous items state
  useEffect(() => {
    // console.log("USE EFFECT PREVITEMS", prevItems);
    setPrevItems(items);
  }, [items]);

  // run on load to get the stored theme & todos
  useEffect(() => {
    fetchTodos();
    const storedMode = localStorage.getItem("mode");
    if (storedMode) {
      setMode(storedMode);
      if (storedMode === "dark") {
        document.body.classList.add("dark");
      }
    } else if (storedMode === "light") {
      setMode("light");
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setMode("dark");
    } else {
      setMode("light");
    }
  }, []);

  // fetches todos from the server
  async function fetchTodos() {
    const response = await axios.get(`${API_URL}/todos`);
    setItems(response.data);
  }

  function handleChangeMode() {
    if (mode === "dark") {
      setMode("light");
      localStorage.setItem("mode", "light");
    } else {
      setMode("dark");
      localStorage.setItem("mode", "dark");
    }
    document.body.classList.toggle("dark");
  }

  async function handleCreateTodo(todoContent) {
    try {
      const newTodo = await axios.post(`${API_URL}/todos`, {
        content: todoContent,
        index: items.length,
      });
      console.log("item created!", newTodo);
      setItems((oldItems) => [...oldItems, newTodo.data]);
    } catch (err) {
      console.error("Unable to create new todo");
      throw new Error(err.message);
    }
  }

  async function handleItemDelete(itemId) {
    try {
      await axios.delete(`${API_URL}/todos/${itemId}`).data;
      setItems((oldItems) => oldItems.filter((i) => i._id !== itemId));
    } catch (error) {
      console.error(error);
    }
  }

  async function handleItemUpdate(itemId, checked) {
    try {
      const { data: updatedItem } = await axios.patch(
        `${API_URL}/todos/${itemId}`,
        {
          completed: checked,
        }
      );

      setItems((oldItems) =>
        oldItems.map((item) => {
          if (item._id === itemId) return updatedItem;
          else return item;
        })
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function handleClearCompleted() {
    try {
      const idsToDelete = items
        .filter((item) => item.completed)
        .map((item) => item._id);
      console.log("ids to delete: ", idsToDelete);
      await axios.delete(`${API_URL}/todos/`, { data: { ids: idsToDelete } });

      setItems((oldItems) =>
        oldItems.filter((i) => !idsToDelete.includes(i._id))
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDropEnd(result) {
    // old version
    /*const { destination, source } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newItems = Array.from(items);
    newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, items[source.index]);

    setItems(newItems);
    */

    const { destination, source } = result;
    console.log("[handleDropEnd] result: ", result);
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newItems = Array.from(items);
    newItems.splice(source.index, 1); // na posição source.index remove 1 item
    newItems.splice(destination.index, 0, items[source.index]); // na posição destination.index adicionar o items[source.index]

    setItems(newItems);
    console.log("[handleDropEnd] newItems: ", newItems);
    //este array não devia conter todos os todos; só aqueles que são afetados pelo drag e drop e respetivos novos indices

    const startIndex = Math.min(source.index, destination.index);
    const endIndex = Math.max(source.index, destination.index);
    // const data = newItems.slice(startIndex, endIndex + 1);

    // await updateIndexes(start, end, data)
    const data = [];

    for (let i = startIndex; i <= endIndex; i++) {
      console.log(newItems[i]);
      data.push({
        id: newItems[i]._id,
        index: i,
        // content: newItems[i].content,
      });
    }

    console.log("[handleDropEnd] data: ", data);
    // console.log("[handleDropEnd] antes do axios, items: ", items);
    try {
      await axios.patch(`${API_URL}/todos/`, { data });
    } catch (error) {
      if (prevItems !== null) {
        setItems(prevItems);
      }
    }
  }

  return (
    <DragDropContext onDragEnd={handleDropEnd}>
      <div className="flex-container">
        <header className="header flex justify-space-between">
          <h1 className="heading-1">Todo</h1>
          <ThemeSwitcher mode={mode} onChange={handleChangeMode} />
        </header>
        <main>
          <CreateTodo onSubmit={handleCreateTodo} />
          <TodoList
            items={items}
            onItemDelete={handleItemDelete}
            onItemUpdate={handleItemUpdate}
            onClearCompleted={handleClearCompleted}
          />
        </main>
        <footer>
          Challenge by{" "}
          <a href="https://www.frontendmentor.io/challenges/todo-app-Su1_KokOW">
            Frontend Mentor
          </a>
          . Coded by <a href="https://github.com/carlaalmeida">carlaalmeida</a>.
        </footer>
      </div>
    </DragDropContext>
  );
}

export default App;
