import React from "react";
import TodoList from "./TodoList";

import "./index.css";

export default function App() {
  return (
    // card with centered content
    <div className="bg-yellow-500">
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white shadow-lg rounded-lg p-4 w-96">
          <h1 className="text-2xl font-bold mb-4">Todo List</h1>
          <TodoList />
        </div>
      </div>
    </div>
  );
}
