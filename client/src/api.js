import axios from "axios";

const API_URL = import.meta.env.VITE_API_SERVER;

// fetches todos from the server
export async function fetchTodos() {
  try {
    const response = await axios.get(`${API_URL}/todos`);

    return response.data;
  } catch (error) {
    console.log(error);
    throw {
      message: "Failed to fetch todos",
      status: error.status,
      code: error.code,
    };
  }
}

// creates new todo at given index
export async function createTodo(content, index = -1) {
  try {
    const { data: newTodo, error } = await axios.post(`${API_URL}/todos`, {
      content,
      index,
    });
    if (error) {
      throw new Error(error);
    }
    return newTodo;
  } catch (error) {
    console.error(error);
    throw {
      message: "Failed to create todo",
      status: error.status,
      code: error.code,
    };
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
    console.error(error);
    throw {
      message: "Failed to delete item",
      status: error.status,
      code: error.code,
    };
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
    console.error(error);
    throw {
      message: "Failed to update status",
      status: error.status,
      code: error.code,
    };
  }
}

// updates a set of todos with new indexes
export async function updateTodos(data) {
  try {
    return await axios.patch(`${API_URL}/todos/`, { data });
  } catch (error) {
    console.error(error);
    throw {
      message: "Failed to reorder list",
      status: error.status,
      code: error.code,
    };
  }
}

// deletes all the todos with the given ids
export async function deleteTodos(idsToDelete) {
  
  if (idsToDelete.length === 0)
    throw {
      message: "Nothing to delete",
    };
  try {
    const { data: newItems } = await axios.delete(`${API_URL}/todos/`, {
      data: { ids: idsToDelete },
    });
    if (newItems.error) {
      throw new Error(newItems.error);
    }
    return newItems;
  } catch (error) {
    console.error(error);
    throw {
      message: "Failed to delete completed todos",
      status: error.status,
      code: error.code,
    };
  }
}
