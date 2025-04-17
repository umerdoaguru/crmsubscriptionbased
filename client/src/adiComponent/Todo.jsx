import React, { useEffect, useState } from "react";

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-600",
  Completed: "bg-green-100 text-green-600",
  Upcoming: "bg-blue-100 text-blue-600",
  Canceled: "bg-red-100 text-red-600",
};

const ToDoList = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/todo-list");
        const data = await response.json();
        // Process and set the to-do data
        setTodos(data);
      } catch (error) {
        console.error("Error fetching to-dos:", error);
      }
    };

    fetchTodos();
  }, []);

  return (
    <div className="p-4 mt-6 bg-white rounded-lg shadow-lg">
      <h3 className="mb-4 text-lg font-semibold">To Do List</h3>
      <ul className="divide-y divide-gray-200">
        {todos.map((todo, idx) => (
          <li
            key={idx}
            className="px-4 py-3 transition duration-200 rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{todo.title}</span>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  statusStyles[todo.status] || "bg-gray-100 text-gray-600"
                }`}
              >
                {todo.status || "N/A"}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              {new Date(todo.date).toLocaleDateString()} {todo.time}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoList;
