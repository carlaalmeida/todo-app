import { useEffect, useState } from "react";
import CreateTodo from "./CreateTodo";

import ListSkeleton from "./ListSkeleton";
import TodoList from "./TodoList";
import { useQuery } from "@tanstack/react-query";

import { fetchTodos } from "../api";

import toast, { Toaster } from "react-hot-toast";
import { toastIcon, toastStyles } from "../toastOptions";
import Error from "./Error";

export default function AppContent() {
  const { isPending, isError, data, error, refetch } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    retry: false,
  });

  const [todos, setTodos] = useState(data || []);

  useEffect(() => {
    setTodos(data || []);
  }, [data]);

  function handleRetry() {
    refetch();
  }

  function handleMutation(info) {
    const { error, message } = info;

    if (error) {
      toast.error(`There was an error: ${error.message}`);
    } else {
      toast.success(message);
    }
  }

  // return early if there's an error
  if (isError) {
    return <Error error={error} onRetry={handleRetry} />;
  }

  if (isPending) return <ListSkeleton count={5} />;

  return (
    <>
      <Toaster
        toastOptions={{
          style: toastStyles,
          iconTheme: toastIcon,
        }}
      />
      <CreateTodo onCreate={handleMutation} />
      <TodoList
        todos={todos}
        onReorder={(newItems) => setTodos(newItems)}
        onMutation={handleMutation}
      />
    </>
  );
}
