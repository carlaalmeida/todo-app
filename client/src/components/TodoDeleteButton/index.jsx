import "./index.scss";
import CrossIcon from "/images/icon-cross.svg";

export default function TodoDeleteButton({ onDelete }) {
  return (
    <button
      className="todo-delete-button sm-only"
      type="button"
      onClick={onDelete}
    >
      <img src={CrossIcon} alt="Delete" />
    </button>
  );
}
