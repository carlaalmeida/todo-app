import { TodoFilter } from "./TodoFilter";

export function TodoListFooter(props) {
  const { itemsLeft, handleFilterChange, filter, onClearCompleted } = props;
  return (
    <>
      <p>{itemsLeft} items left</p>
      <div className="md-up">
        <TodoFilter onSelect={handleFilterChange} currentFilter={filter} />
      </div>
      <button
        className="todo-button-link"
        type="button"
        onClick={() => onClearCompleted()}
      >
        Clear Completed
      </button>
    </>
  );
}
