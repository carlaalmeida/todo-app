import "./index.scss";

export default function TodoCheckbox({ readOnly, value, toggleCheck }) {
  return (
    <label className="todo-checkbox">
      <input
        className="todo-checkbox__input"
        type="checkbox"
        defaultChecked={value}
        readOnly={readOnly}
        onChange={toggleCheck}
      />
      <span className="todo-checkbox__circle" data-checked={value}></span>
    </label>
  );
}
