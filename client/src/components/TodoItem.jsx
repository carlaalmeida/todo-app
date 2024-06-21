import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import "./TodoItem.scss";
import Checkbox from "./Checkbox";
import DeleteButton from "./DeleteButton";
import ItemContent from "./ItemContent";

export function TodoItem(props) {
  const [checked, setChecked] = useState(props.checked);
  const { id, index, text, onChange, onDelete } = props;

  const updateItem = (value) => {
    setChecked(value);
    onChange(id, value);
  };

  const handleClick = () => {
    setChecked((prevValue) => !prevValue);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  const getClassName = (isDragging) => {
    return isDragging ? "flex TodoItem TodoItem-dragging" : "flex TodoItem";
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <form
          className={getClassName(snapshot.isDragging)}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Checkbox
            id={id}
            readOnly={false}
            value={checked}
            onCheck={updateItem}
          />
          <ItemContent text={text} isChecked={checked} onClick={handleClick} />

          <DeleteButton onDelete={handleDelete} />
        </form>
      )}
    </Draggable>
  );
}
