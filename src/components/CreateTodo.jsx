import { useState } from "react";

export function CreateTodo(props) {
  const { onSubmit } = props;

  const [content, setContent] = useState("");

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (content !== "") {
        onSubmit(content);
        setContent("");
      }
    }
  }

  return (
    <form className="flex create-todo">
      <label className="checkbox-container">
        <input type="checkbox" className="todo-checkbox" />
        <span className="checkbox-circle"></span>
      </label>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        className="create-todo-input"
        placeholder="Create a new todo..."
      />
    </form>
  );
}
