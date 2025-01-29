import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { Clock, Circle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import EditTodoModal from "../../Components/Modals/EditTodoModal";

const Pending = () => {
  const [pendingTodos, setPendingTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, currentUser, currentUserLoading } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);

  useEffect(() => {
    fetchPendingTodos();
  }, [currentUser, isAuthenticated]);

  const fetchPendingTodos = async () => {
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

      const pending = response.data.filter(todo => !todo.completed);
      setPendingTodos(pending);
    } catch (error) {
      console.error("Error fetching pending todos:", error);
      toast.error("Failed to load pending todos");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTodoCompletion = async (todo) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const updatedTodo = { ...todo, completed: true };

    try {
      const response = await axios.put(
        `https://ticks-api.onrender.com/todos/api/todos/${todo._id}`,
        updatedTodo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPendingTodos((prevTodos) =>
        prevTodos.filter((t) => t._id !== response.data._id)
      );
      toast.success("Todo marked as completed!");
    } catch (error) {
      console.error("Error updating todo:", error);
      toast.error("Failed to update todo");
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
      setPendingTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== todoId));
      toast.success("Todo deleted successfully!");
    } catch (error) {
      console.error("Delete todo error:", error);
      toast.error("Failed to delete todo");
    }
  };

  const handleOpenEditModal = (todo) => {
    setCurrentTodo(todo);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setCurrentTodo(null);
    setIsEditModalOpen(false);
  };

  const editTodo = async (updatedTodo) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.put(
        `https://ticks-api.onrender.com/todos/api/todos/edit/${updatedTodo._id}`,
        updatedTodo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPendingTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === response.data._id ? response.data : todo
        )
      );
      toast.success("Todo updated successfully!");
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating todo:", error);
      toast.error("Failed to update todo");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center p-8">
        <p className="text-gray-500">Loading pending todos...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center px-4">
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-yellow-500" />
          <h1 className="text-2xl font-bold">Pending Tasks</h1>
        </div>
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
          {pendingTodos.length} pending
        </span>
      </div>

      <EditTodoModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        todo={currentTodo}
        onEditTodo={editTodo}
      />

      <div className="w-full bg-white shadow-lg rounded-lg p-6">
        {pendingTodos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No pending todos
          </div>
        ) : (
          <ul className="space-y-4">
            {pendingTodos.map((todo) => (
              <li
                key={todo._id}
                className="flex flex-col p-4 rounded-md bg-white border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center flex-1 gap-3">
                    <button
                      onClick={() => toggleTodoCompletion(todo)}
                      className="focus:outline-none"
                    >
                      <Circle className="w-5 h-5 text-gray-400 hover:text-green-500 cursor-pointer" />
                    </button>
                    <div className="flex-1">
                      <span className="font-semibold">
                        {todo.title}
                      </span>
                      {todo.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {todo.description}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2 text-sm">
                        {todo.priority && (
                          <span className={`px-2 py-1 rounded-full text-white
                            ${todo.priority === "high" ? "bg-red-500" : 
                              todo.priority === "medium" ? "bg-yellow-500" : "bg-green-500"}`}>
                            {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                          </span>
                        )}
                        {todo.dueDate && (
                          <span className="px-2 py-1 rounded-lg bg-gray-200 text-gray-700">
                            Due: {new Date(todo.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleOpenEditModal(todo)} 
                      className="text-blue-500 hover:text-blue-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo._id)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                {todo.subtodos && todo.subtodos.length > 0 && (
                  <div className="mt-4 ml-8">
                    <ul className="space-y-2">
                      {todo.subtodos.map((subtask, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-600">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          <span>{subtask.title}</span>
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

export default Pending;