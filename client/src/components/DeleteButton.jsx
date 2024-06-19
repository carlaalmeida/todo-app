export default function DeleteButton({ onDelete }) {
  return (
    <button
      className="button button-delete todo-item-action sm-only justify-self-end"
      type="button"
      onClick={onDelete}
    >
      <img src="/images/icon-cross.svg" alt="Delete" />
    </button>
  );
}
