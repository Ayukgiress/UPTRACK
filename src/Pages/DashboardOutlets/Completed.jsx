import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";

const Completed = ({ completedTodos = [], onToggleTodoCompletion, onDeleteTodo }) => {
  useEffect(() => {
    console.log("Completed Todos:", completedTodos);
  }, [completedTodos]);

  return (
    <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-lg w-full">
      <h3 className="text-2xl font-semibold text-gray-800">Completed Todos</h3>
      {completedTodos.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {completedTodos.map((todo) => (
            <li
              key={todo._id}
              className="flex flex-col p-4 rounded-md bg-gray-200 hover:shadow-lg border border-gray-200"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <div className="flex-1 text-gray-500 line-through">
                    <span className="font-bold text-lg">{todo.title}</span>
                    {todo.description && (
                      <span className="ml-2 text-sm text-gray-600">
                        {todo.description}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onToggleTodoCompletion(todo._id)}
                    className="text-blue-500 hover:text-blue-600 text-sm"
                  >
                    Mark as Pending
                  </button>
                  <button
                    onClick={() => onDeleteTodo(todo._id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-gray-500 text-center">No completed todos</p>
      )}
    </div>
  );
};

export default Completed;