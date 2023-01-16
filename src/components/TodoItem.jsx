import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";

export function TodoItem(props) {
  const [checked, setChecked] = useState(props.checked);
  const { id, index, text, onChange, onDelete } = props;

  function handleChange() {
    setChecked(!checked);
    onChange(id, !checked);
  }

  function handleDelete() {
    onDelete(id);
  }

  function getClassName(isDragging) {
    return isDragging ? "flex todo-item todo-item-dragging" : "flex todo-item";
  }

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <form
          className={getClassName(snapshot.isDragging)}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <label className="checkbox-container">
            <span
              className={checked ? "todo-text todo-text-checked" : "todo-text"}
            >
              {text}
            </span>

            <input
              id={id}
              type="checkbox"
              checked={checked}
              onChange={handleChange}
            />
            <span className="checkbox-circle" data-checked={checked}></span>
          </label>
          <button
            className="button button-delete todo-item-action sm-only justify-self-end"
            type="button"
            onClick={() => handleDelete()}
          >
            <img src="/images/icon-cross.svg" alt="Delete" />
          </button>
        </form>
      )}
    </Draggable>
  );
}
