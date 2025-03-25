import "./index.scss";
import { useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import TodoFilter from "../TodoFilter";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodo, deleteTodos, updateTodo, updateTodos } from "../../api";
import TodoListFooter from "../TodoListFooter";
import TodoItem from "../TodoItem";

export default function TodoList({ todos, onReorder, onMutation }) {
  const [filter, setFilter] = useState("All");
  const queryClient = useQueryClient();

  const updateTodoMutation = useMutation({
    mutationFn: ({ id, status }) => {
      return updateTodo(id, status);
    },
    onSuccess: () => {
      // updates the list
      queryClient.invalidateQueries(["todos"]);
      onMutation({ message: "Status updated" });
    },
    onError: (error) => {
      onMutation({ error });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: ({ id }) => {
      return deleteTodo(id);
    },
    onSuccess: () => {
      // updates the list
      queryClient.invalidateQueries(["todos"]);
      onMutation({ message: "Item deleted" });
    },
    onError: (error) => {
      onMutation({ error });
    },
  });

  const reorderListMutation = useMutation({
    mutationFn: ({ itemsToUpdate }) => {
      return updateTodos(itemsToUpdate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
    onError: (error, { oldTodos }) => {
      onReorder(oldTodos); // go back to previous state
      onMutation({ error });
    },
  });

  const deleteTodosMutation = useMutation({
    mutationFn: (todosIds) => {
      return deleteTodos(todosIds);
    },
    onSuccess: () => {
      // updates the list
      queryClient.invalidateQueries(["todos"]);

      onMutation({ message: "Deleted completed todos" });
    },
    onError: (error) => {
      onMutation({ error });
    },
  });

  const filteredList = filterList(todos, filter);

  const filterElement = (
    <TodoFilter onSelect={handleFilterChange} currentFilter={filter} />
  );

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

  function updateItemStatus(id) {
    const { completed } = todos.find((todo) => todo._id === id);
    updateTodoMutation.mutate({ id, status: !completed });
  }

  function deleteItem(id) {
    deleteTodoMutation.mutate({ id });
  }

  function handleDropEnd(result) {
    const { destination, source } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    const newItems = Array.from(todos);
    newItems.splice(source.index, 1); // na posição source.index remove 1 item
    newItems.splice(destination.index, 0, todos[source.index]); // na posição destination.index adicionar o items[source.index]

    const startIndex = Math.min(source.index, destination.index);
    const endIndex = Math.max(source.index, destination.index);
    const itemsToUpdate = [];
    for (let i = startIndex; i <= endIndex; i++) {
      itemsToUpdate.push({
        id: newItems[i]._id,
        index: i,
      });
    }

    onReorder(newItems);
    reorderListMutation.mutate({ itemsToUpdate, oldTodos: todos });
  }

  function handleClearCompleted() {
    const idsToDelete = todos
      .filter((item) => item.completed)
      .map((item) => item._id);
    deleteTodosMutation.mutate(idsToDelete);
  }

  return (
    <div className="todo-list">
      <DragDropContext onDragEnd={handleDropEnd}>
        <Droppable droppableId="todo-list">
          {(provided) => (
            <ul
              className="todo-list__items"
              {...provided.props}
              ref={provided.innerRef}
            >
              {filteredList.length === 0 && (
                <li className="todo-list__empty-message">
                  No items to display
                </li>
              )}
              {filteredList.map((item, index) => {
                return (
                  <TodoItem
                    key={item._id}
                    id={item._id}
                    text={item.content}
                    checked={item.completed}
                    toggleStatus={updateItemStatus}
                    onDelete={deleteItem}
                    index={index}
                    isDraggable={filter === "All"}
                  />
                );
              })}
              {provided.placeholder}
              <li>
                <TodoListFooter
                  itemsLeft={calculateItemsLeft()}
                  handleFilterChange={handleFilterChange}
                  filter={filter}
                  onClearCompleted={handleClearCompleted}
                >
                  {filterElement}
                </TodoListFooter>
              </li>
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <div className="sm-only">{filterElement}</div>
      <div className="todo-list__instructions">
        Drag and drop to reorder list
      </div>
    </div>
  );
}
