import "./Input.scss";
import { useState } from "react";

export default function Input({ onSubmit }) {
  const [value, setValue] = useState("");

  const handleChange = (evt) => {
    setValue(evt.target.value);
  };
  const handleKeyDown = (evt) => {
    if (evt.key === "Enter") {
      evt.preventDefault();
      if (value !== "") {
        onSubmit(value);
        setValue("");
      }
    }
  };
  return (
    <input
      className="Input"
      type="text"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder="Create a new todo..."
    />
  );
}
