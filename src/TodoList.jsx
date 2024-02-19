import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://simple-reactjs-todo-a6o63nt67-amranibrahim19.vercel.app/api/todos");
        const data = await response.json();

        console.log(data);

        setTodos(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addTodo = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://simple-reactjs-todo-a6o63nt67-amranibrahim19.vercel.app/api/todos", {
        task: inputValue,
      });
      console.log("Data added successfully:", response.data);
      // Optionally, refetch the data after the update
      setTodos([...todos, response.data]);

      toast.success("Data added successfully !", {
        position: "top-center",
      });

      setInputValue("");
    } catch (error) {
      console.error("Error adding data:", error);

      toast.error("Error adding data !", {
        position: "top-center",
      });
    }
  };

  //   update todo
  const updateTodo = async (id) => {
    const todo = todos.find((todo) => todo.id === id);
    const updatedTodo = { ...todo, completed: !todo.completed };
    try {
      const response = await axios.put(
        `https://simple-reactjs-todo-a6o63nt67-amranibrahim19.vercel.app/api/todos/${id}`,
        updatedTodo
      );
      console.log("Data updated successfully:", response.data);
      // Optionally, refetch the data after the update
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? response.data : todo
      );
      setTodos(updatedTodos);

      toast.success("Success Notification !", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Error updating data:", error);

      toast.error("Error updating data !", {
        position: "top-center",
      });
    }
  };

  //   delete todo
  const deleteTodo = async (id) => {
    try {
      const response = await axios.delete(
        `https://simple-reactjs-todo-a6o63nt67-amranibrahim19.vercel.app/api/todos/${id}`
      );
      console.log("Data updated successfully:", response.data);
      // Optionally, refetch the data after the update
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);

      toast.success("Data updated successfully !", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Error updating data:", error);

      toast.error("Error updating data !", {
        position: "top-center",
      });
    }
  };

  return (
    <div>
      {/* form to create new */}
      <form className="mb-4" onSubmit={addTodo}>
        <input
          id="task"
          name="task"
          type="text"
          required
          className="p-3 mb-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Add a new todo"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add Todo
        </button>
      </form>

      <div className="p-4">
        <ul role="list" className="divide-y divide-gray-100">
          {todos.map((todo) => (
            <li key={todo.id} className="flex justify-between gap-x-6 py-5">
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <label className="cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={todo.completed}
                      onChange={() => updateTodo(todo.id)}
                    />
                    <span
                      className={`${
                        todo.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {todo.task}
                    </span>
                  </label>
                </div>
              </div>
              <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 cursor-pointer"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  onClick={() => deleteTodo(todo.id)}
                >
                  <path
                    fillRule="evenodd"
                    d="M5 5a1 1 0 011-1h8a1 1 0 011 1v1h2a1 1 0 110 2h-.586l-1.207 10.878A2 2 0 0113.207 20H6.793a2 2 0 01-1.999-1.122L3.586 9H3a1 1 0 110-2h2V5zm2 2v10h6V7H7zm2 2a1 1 0 011 1v6a1 1 0 11-2 0v-6a1 1 0 011-1zm4 0a1 1 0 011 1v6a1 1 0 11-2 0v-6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000} // Close the toast after 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default TodoList;
