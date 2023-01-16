import { useEffect } from "react";
import { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { CreateTodo } from "./components/CreateTodo";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { TodoList } from "./components/TodoList";

function App() {
  const initialItems = [
    { id: "item-1", checked: true, text: "Complete online JavaScript course" },
    { id: "todo-2", checked: false, text: "Jog around the park 3x" },
    { id: "todo-3", checked: false, text: "10 minutes meditation" },
    { id: "todo-4", checked: false, text: "Read for 1 hour" },
    { id: "todo-5", checked: false, text: "Pick up groceries" },
    {
      id: "todo-6",
      checked: false,
      text: "Complete Todo App on Frontend Mentor",
    },
  ];

  const [mode, setMode] = useState(null);

  const [items, setItems] = useState(initialItems);

  // run on load to get the stored theme
  useEffect(() => {
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

  function handleCreateTodo(todoContent) {
    setItems([
      ...items,
      {
        id: "item-" + (items.length + 1),
        checked: false,
        text: todoContent,
      },
    ]);
  }

  function handleItemDelete(itemId) {
    const newItems = items.filter((item) => item.id !== itemId);
    setItems(newItems);
  }

  function handleItemUpdate(itemId, checked) {
    const newItems = items.map((item) => {
      if (item.id === itemId) return { ...item, checked: checked };
      return item;
    });
    setItems(newItems);
  }

  function handleClearCompleted() {
    const newItems = items.filter((item) => !item.checked);
    console.log("new items", newItems);
    setItems(newItems);
  }

  function handleDropEnd(result) {
    const { destination, source } = result;

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
  }

  return (
    <DragDropContext onDragEnd={handleDropEnd}>
      <div className="container">
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
      </div>
    </DragDropContext>
  );
}

export default App;
