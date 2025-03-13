import "./index.scss";

const FILTERS = ["All", "Active", "Completed"];

export default function TodoFilter({ onSelect, currentFilter }) {
  function handleFilterSelection(filter) {
    onSelect(filter);
  }

  return (
    <ul className="todo-filter">
      {FILTERS.map((filterItem) => {
        return (
          <li key={filterItem}>
            <button
              type="button"
              className={
                currentFilter === filterItem
                  ? "button-link button-link--active"
                  : "button-link"
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
