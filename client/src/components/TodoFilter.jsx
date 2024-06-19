const FILTERS = ["All", "Active", "Completed"];

export function TodoFilter({ onSelect, currentFilter }) {
  function handleFilterSelection(filter) {
    onSelect(filter);
  }

  return (
    <ul className="todo-filter flex justify-center">
      {FILTERS.map((filterItem) => {
        return (
          <li key={filterItem}>
            <button
              type="button"
              className={
                currentFilter === filterItem
                  ? "todo-button-link todo-button-link-active"
                  : "todo-button-link"
              }
              onClick={() => handleFilterSelection(filterItem)}
            >
              {filterItem}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
