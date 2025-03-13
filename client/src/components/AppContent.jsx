import { Suspense } from "react";
import CreateTodo from "./CreateTodo";

import ListSkeleton from "./ListSkeleton";
import TodoList from "./TodoList";

export default function AppContent() {
  return (
    <main>
      <Suspense fallback={<ListSkeleton count={5} />}>
        <CreateTodo />
        <TodoList />
      </Suspense>
    </main>
  );
}
