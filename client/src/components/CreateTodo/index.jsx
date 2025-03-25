import "./index.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo } from "../../api";
import Input from "../TodoInput";
import TodoCheckbox from "../TodoCheckbox";

export default function CreateTodo({ onCreate }) {
  const queryClient = useQueryClient();

  const createTodoMutatation = useMutation({
    mutationFn: (content) => {
      const index = queryClient.getQueryData(["todos"]).length;
      return createTodo(content, index);
    },
    onSuccess: () => {
      // updates the list
      queryClient.invalidateQueries(["todos"]);
      onCreate({ message: "Created new todo" });
    },
    onError: (error) => {
      onCreate({ error });
    },
  });

  function handleSubmit(content) {
    createTodoMutatation.mutate(content);
  }

  return (
    <form className="create-todo">
      <TodoCheckbox readOnly={true} />
      <Input onSubmit={handleSubmit} />
    </form>
  );
}
