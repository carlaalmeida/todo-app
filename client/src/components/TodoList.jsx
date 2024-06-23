import "./TodoList.scss";
import { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { TodoFilter } from "./TodoFilter";
import { TodoItem } from "./TodoItem";
import { TodoListFooter } from "./TodoListFooter";
// import ListSkeleton from "./ListSkeleton";

export function TodoList({
  items,
  isLoading,
  onItemDelete,
  onItemUpdate,
  onClearCompleted,
}) {
  const [filter, setFilter] = useState("All");

  const filteredList = filterList(items, filter);

  function calculateItemsLeft() {
    return filteredList.filter((i) => !i.completed).length;
  }

  function handleFilterChange(newFilter) {
    setFilter(newFilter);
  }

  function filterList(list, filter) {
    if (filter === "All") {
      return list;
    }
    if (filter === "Active") {
      return list.filter((i) => !i.completed);
    }
    if (filter === "Completed") {
      return list.filter((i) => i.completed);
    }
    return [];
  }

  function updateItemStatus(id, status) {
    onItemUpdate(id, status);
  }

  function deleteItem(id) {
    onItemDelete(id);
  }

  return (
    <>
      <Droppable droppableId="todo-list">
        {(provided, snapshot) => (
          <ul className="TodoList" {...provided.props} ref={provided.innerRef}>
            {/* {isLoading && <ListSkeleton />} */}
            {!isLoading && filteredList.length === 0 && (
              <li className="TodoItem">No items to display</li>
            )}
            {filteredList.map((item, index) => {
              return (
                <TodoItem
                  key={item._id}
                  id={item._id}
                  text={item.content}
                  checked={item.completed}
                  onChange={updateItemStatus}
                  onDelete={deleteItem}
                  index={index}
                  isDraggable={filter === "All"}
                />
              );
            })}
            {provided.placeholder}

            <li className="todo-footer flex justify-space-between">
              <TodoListFooter
                itemsLeft={calculateItemsLeft()}
                handleFilterChange={handleFilterChange}
                filter={filter}
                onClearCompleted={onClearCompleted}
              />
            </li>
          </ul>
        )}
      </Droppable>
      <div className="sm-only">
        <TodoFilter onSelect={handleFilterChange} currentFilter={filter} />
      </div>
    </>
  );
}
