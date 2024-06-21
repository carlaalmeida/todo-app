import "./DeleteButton.scss";

export default function DeleteButton({ onDelete }) {
  return (
    <button
      className="DeleteButton button todo-item-action sm-only"
      type="button"
      onClick={onDelete}
    >
      <img src="/images/icon-cross.svg" alt="Delete" />
    </button>
  );
}
