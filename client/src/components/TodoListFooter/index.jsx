import "./index.scss";

export default function TodoListFooter({
  itemsLeft,
  onClearCompleted,
  children,
}) {
  return (
    <section className="todo-list-footer">
      <span>{itemsLeft} items left</span>
      <div className="todo-list-footer__filter md-up">{children}</div>
      <button
        className="button-link"
        type="button"
        onClick={() => onClearCompleted()}
      >
        Clear Completed
      </button>
    </section>
  );
}
