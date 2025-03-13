import "./index.scss";

import { Draggable } from "@hello-pangea/dnd";

import TodoItemContent from "../TodoItemContent";
import TodoCheckbox from "../TodoCheckbox";
import TodoDeleteButton from "../TodoDeleteButton";

export default function TodoItem({
  id,
  index,
  text,
  isDraggable,
  checked,
  toggleStatus,
  onDelete,
}) {
  const handleClick = () => {
    toggleStatus(id);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  const handleKeyDown = (evt) => {
    if (evt.key === "Enter") {
      toggleStatus(id);
    }
  };

  // todo usar https://www.npmjs.com/package/clsx
  const getClassName = (isDragging) => {
    return isDragging ? "todo-item todo-item--dragging" : "todo-item";
  };

  return (
    <li>
      <Draggable draggableId={id} index={index} isDragDisabled={!isDraggable}>
        {(provided, snapshot) => (
          <form
            className={getClassName(snapshot.isDragging)}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onKeyDown={handleKeyDown}
          >
            <TodoCheckbox
              id={id}
              readOnly={false}
              value={checked}
              toggleCheck={() => {
                toggleStatus(id);
              }}
            />
            <TodoItemContent
              text={text}
              isChecked={checked}
              onClick={handleClick}
            />

            <TodoDeleteButton onDelete={handleDelete} />
          </form>
        )}
      </Draggable>
    </li>
  );
}
