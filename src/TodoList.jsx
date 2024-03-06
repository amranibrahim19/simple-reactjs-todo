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
        const response = await fetch("http://127.0.0.1:8000/api/tasks");
        const data = await response.json();

        const dataList = data.tasks.map((task) => {
          return {
            id: task.id,
            task: task.title,
            status: task.status,
          };
        });

        setTodos(dataList);
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
      const response = await axios.post("http://127.0.0.1:8000/api/tasks", {
        title: inputValue,
      });
      console.log(response.data.message);

      const newTodo = {
        id: response.data.id,
        task: inputValue,
        status: false,
      };

      setTodos([...todos, newTodo]);

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
    const updatedTodo = {
      title: todo.task,
      status: !todo.status,
    };

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/tasks/${id}`,
        updatedTodo
      );
      console.log("Data updated successfully:", response.data);

      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, status: !todo.status } : todo
      );

      setTodos(updatedTodos);

      toast.success(response.data.message, {
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
        `http://127.0.0.1:8000/api/tasks/${id}`
      );
      console.log("Data updated successfully:", response.data);
      // Optionally, refetch the data after the update
      const updatedTodos = todos.filter((todo) => todo.id !== id);

      setTodos(updatedTodos);

      toast.success(response.data.message, {
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
    <div className="w-100">
      {/* form to create new */}
      <form className="mb-4" onSubmit={addTodo}>
        <input
          id="task"
          name="title"
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
          {todos.map((todo, index) => (
            <li key={index} className="flex justify-between gap-x-6 py-5">
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <label className="cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={todo.status}
                      onChange={() => updateTodo(todo.id)}
                    />
                    <span
                      className={`${
                        todo.status ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {todo.task}
                    </span>
                  </label>
                </div>
              </div>
              <div className=" flex items-center  justify-end ">
                {/* <svg
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
                </svg> */}

                <button
                  className="bg-red-500 shadow-sm px-3 py-1.5 text-sm font-semibold leading-6 text-white rounded-md text-sm text-end"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
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
