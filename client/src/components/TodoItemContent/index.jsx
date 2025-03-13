import "./index.scss";

export default function TodoItemContent({ text, isChecked, onClick }) {
  const className = `todo-item-content ${
    isChecked ? "todo-item-content--checked" : ""
  }`;
  return (
    <p className={className} onClick={onClick}>
      {text}
    </p>
  );
}
