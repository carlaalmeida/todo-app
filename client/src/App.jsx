import { useEffect } from "react";
import { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { CreateTodo } from "./components/CreateTodo";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { TodoList } from "./components/TodoList";
import axios from "axios";

const findChanges = (oldArr, newArr) => {
  const changed = [];
  for (let i = 0; i < newArr.length; i++) {
    if (oldArr[i].index !== newArr[i].index) {
      changed.push(newArr[i]);
    }
  }
  return changed;
};

function App() {
  const API_URL = process.env.REACT_APP_API_SERVER;

  const [mode, setMode] = useState(null);

  const [items, setItems] = useState([]);
  const [prevItems, setPrevItems] = useState(null);

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

  // save previous items state in case of error
  useEffect(() => {
    setPrevItems(items);
  }, [items]);

  // fetches todos from the server
  async function fetchTodos() {
    try {
      const response = await axios.get(`${API_URL}/todos`);
      setItems(response.data);
    } catch (error) {
      console.error(error);
    }
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
      const { data: newTodo } = await axios.post(`${API_URL}/todos`, {
        content: todoContent,
        index: items.length,
      });
      if (newTodo.error) {
        throw new Error(newTodo.error);
      }
      setItems((oldItems) => [...oldItems, newTodo]);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleItemDelete(itemId) {
    try {
      const { data } = await axios.delete(`${API_URL}/todos/${itemId}`);
      if (data.error) {
        throw new Error(data.error);
      }
      setItems(data);
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
      if (updatedItem.error) {
        throw new Error(updatedItem.error);
      }

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
      const { data: newItems } = await axios.delete(`${API_URL}/todos/`, {
        data: { ids: idsToDelete },
      });
      if (newItems.error) {
        throw new Error(newItems.error);
      }
      setItems(newItems);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDropEnd(result) {
    const { destination, source } = result;

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

    const startIndex = Math.min(source.index, destination.index);
    const endIndex = Math.max(source.index, destination.index);

    const itemsToUpdate = [];
    for (let i = startIndex; i <= endIndex; i++) {
      itemsToUpdate.push({
        id: newItems[i]._id,
        index: i,
      });
    }

    try {
      await axios.patch(`${API_URL}/todos/`, { data: itemsToUpdate });
    } catch (error) {
      if (prevItems !== null) {
        setItems(prevItems);
      }
    }
  }

  async function handleListReorder(newOrder) {
    const updates = findChanges(newOrder, [...items]);
    try {
      const newItems = await axios.patch(`${API_URL}/todos/`, {
        data: updates,
      });
      if (newItems.data) setItems(newItems.data);
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
            onReorder={handleListReorder}
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
