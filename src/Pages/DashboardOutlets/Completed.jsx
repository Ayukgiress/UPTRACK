import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { CheckCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Completed = () => {
  const [completedTodos, setCompletedTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, currentUser, currentUserLoading } = useAuth();

  useEffect(() => {
    fetchCompletedTodos();
  }, [currentUser, isAuthenticated]);

  const fetchCompletedTodos = async () => {
    if (currentUserLoading || !isAuthenticated) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://ticks-api.onrender.com/todos/api/todos/${currentUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const completed = response.data.filter(todo => todo.completed);
      setCompletedTodos(completed);
    } catch (error) {
      console.error("Error fetching completed todos:", error);
      toast.error("Failed to load completed todos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`https://ticks-api.onrender.com/todos/api/todos/${todoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCompletedTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== todoId));
      toast.success("Todo deleted successfully!");
    } catch (error) {
      console.error("Delete todo error:", error);
      toast.error("Failed to delete todo");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center p-8">
        <p className="text-gray-500">Loading completed todos...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center px-4">
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <h1 className="text-2xl font-bold">Completed Tasks</h1>
        </div>
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
          {completedTodos.length} completed
        </span>
      </div>

      <div className="w-full bg-white shadow-lg rounded-lg p-6">
        {completedTodos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No completed todos yet
          </div>
        ) : (
          <ul className="space-y-4">
            {completedTodos.map((todo) => (
              <li
                key={todo._id}
                className="flex flex-col p-4 rounded-md bg-gray-50 border border-gray-200"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center flex-1 gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div className="flex-1 text-gray-500">
                      <span className="font-semibold line-through">
                        {todo.title}
                      </span>
                      {todo.description && (
                        <p className="text-sm text-gray-400 line-through mt-1">
                          {todo.description}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2 text-sm">
                        {todo.priority && (
                          <span className={`px-2 py-1 rounded-full text-white opacity-75
                            ${todo.priority === "high" ? "bg-red-500" : 
                              todo.priority === "medium" ? "bg-yellow-500" : "bg-green-500"}`}>
                            {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                          </span>
                        )}
                        {todo.dueDate && (
                          <span className="px-2 py-1 rounded-lg bg-gray-200 text-gray-600">
                            Completed: {new Date(todo.completedAt || todo.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTodo(todo._id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                {todo.subtodos && todo.subtodos.length > 0 && (
                  <div className="mt-4 ml-8">
                    <ul className="space-y-2">
                      {todo.subtodos.map((subtask, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-400">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          <span className="line-through">{subtask.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Completed;