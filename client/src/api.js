import axios from "axios";

const API_URL = import.meta.env.VITE_API_SERVER;

// fetches todos from the server
export async function fetchTodos() {
  try {
    const response = await axios.get(`${API_URL}/todos`);

    return response.data;
  } catch (error) {
    console.error(error);
    // todo
    throw new Error("Failed to fetch data");
  }
}

// creates new todo at given index
export async function createTodo(content, index = -1) {
  try {
    const { data: newTodo } = await axios.post(`${API_URL}/todos`, {
      content,
      index,
    });
    if (newTodo.error) {
      throw new Error(newTodo.error);
    }
    return newTodo;
  } catch (error) {
    // todo
    console.error(error);
  }
}

// deletes todo with given id
export async function deleteTodo(itemId) {
  try {
    const { data } = await axios.delete(`${API_URL}/todos/${itemId}`);
    if (data.error) {
      throw new Error(data.error);
    }
  } catch (error) {
    // todo
    console.error(error);
  }
}

// updates with the completed state the todo with given id
export async function updateTodo(id, completed) {
  try {
    const { data: updatedItem } = await axios.patch(`${API_URL}/todos/${id}`, {
      completed,
    });
    if (updatedItem.error) {
      throw new Error(updatedItem.error);
    }
    return updatedItem;
  } catch (error) {
    // todo
    console.error(error);
  }
}

// updates a set of todos with new indexes
export async function updateTodos(data) {
  try {
    return await axios.patch(`${API_URL}/todos/`, { data });
  } catch (error) {
    // todo
    console.error(error);
  }
}

// deletes all the todos with the given ids
export async function deleteTodos(idsToDelete) {
  try {
    const { data: newItems } = await axios.delete(`${API_URL}/todos/`, {
      data: { ids: idsToDelete },
    });
    if (newItems.error) {
      throw new Error(newItems.error);
    }
    return newItems;
  } catch (error) {
    // todo
    console.error(error);
  }
}
