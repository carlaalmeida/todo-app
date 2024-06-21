import Checkbox from "./Checkbox";
import "./CreateTodo.scss";
import Input from "./Input";

export function CreateTodo({ onSubmit }) {
  function handleSubmit(content) {
    onSubmit(content);
  }

  return (
    <form className="CreateTodo">
      <Checkbox readOnly={true} />
      <Input onSubmit={handleSubmit} />
    </form>
  );
}
