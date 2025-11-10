import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { CheckCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from "../../lib/constants";

const Completed = () => {
  const { t } = useTranslation();
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
      // Fetch todos created by the user
      const createdResponse = await axios.get(
        `${API_BASE_URL}/todos/api/todos/${currentUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch todos assigned to the user
      const assignedResponse = await axios.get(
        `${API_BASE_URL}/todos/api/todos/assigned/${currentUser.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Combine both created and assigned todos
      const allTodos = [...createdResponse.data, ...assignedResponse.data];

      // Remove duplicates based on _id
      const uniqueTodos = allTodos.filter((todo, index, self) =>
        index === self.findIndex(t => t._id === todo._id)
      );

      const completed = uniqueTodos.filter(todo => todo.completed);
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
      await axios.delete(`${API_BASE_URL}/todos/api/todos/${todoId}`, {
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

  const toggleSubtaskCompletion = async (todoId, subtaskIndex) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const todoToUpdate = completedTodos.find(todo => todo._id === todoId);
      if (!todoToUpdate) return;

      const updatedSubtodos = [...todoToUpdate.subtodos];
      updatedSubtodos[subtaskIndex].completed = !updatedSubtodos[subtaskIndex].completed;

      const response = await axios.put(
        `${API_BASE_URL}/todos/api/todos/${todoId}`,
        {
          ...todoToUpdate,
          subtodos: updatedSubtodos
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCompletedTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === response.data._id ? response.data : todo
        )
      );
    } catch (error) {
      console.error("Error updating subtask:", error);
      toast.error("Failed to update subtask");
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
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('Completed')}</h1>
            <p className="text-muted-foreground mt-1">{t('Tasks you\'ve successfully finished')}</p>
          </div>
        </div>
        <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-4 py-2 rounded-xl font-medium">
          {completedTodos.length} {t('completed')}
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
        {completedTodos.length === 0 ? (
          <div className="py-12">
            <CheckCircle className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">{t('No completed tasks yet')}</h3>
            <p className="text-muted-foreground">{t('Start completing tasks to see them here!')}</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {completedTodos.map((todo) => (
            <div
              key={todo._id}
              className="group relative p-6 rounded-2xl transition-all duration-300 border-2 bg-gradient-to-br from-green-50 dark:from-green-900/10 to-emerald-50 dark:to-emerald-900/10 border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 hover:shadow-xl hover:scale-[1.02] cursor-pointer"
            >
              {/* Priority indicator */}
              <div className={`absolute top-4 right-4 w-3 h-3 rounded-full
                ${todo.priority === "high" ? "bg-red-500" :
                  todo.priority === "medium" ? "bg-yellow-500" : "bg-green-500"}`}>
              </div>

              {/* Completion status */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-green-500 text-white flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleDeleteTodo(todo._id)}
                    className="p-2 text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Task content */}
              <div className="space-y-3">
                <h4 className="font-bold text-lg leading-tight text-green-800 dark:text-green-200 line-through">
                  {todo.title}
                </h4>

                {todo.description && (
                  <p className="text-sm leading-relaxed text-green-600 dark:text-green-300 line-through">
                    {todo.description}
                  </p>
                )}

                {/* Task metadata */}
                <div className="flex items-center justify-between pt-2 border-t border-green-100 dark:border-green-800">
                  <div className="flex items-center gap-3 text-xs text-green-600 dark:text-green-300">
                    {todo.dueDate && (
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{t('Completed')}: {new Date(todo.completedAt || todo.updatedAt).toLocaleDateString()}</span>
                      </div>
                    )}

                    {todo.subtodos && todo.subtodos.length > 0 && (
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>{todo.subtodos.length} subtasks</span>
                      </div>
                    )}
                  </div>

                  {/* Priority badge */}
                  {todo.priority && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white opacity-75
                      ${todo.priority === "high" ? "bg-red-500 dark:bg-red-600" :
                        todo.priority === "medium" ? "bg-yellow-500 dark:bg-yellow-600" : "bg-green-500 dark:bg-green-600"}`}>
                      {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                    </span>
                  )}
                </div>
              </div>

              {/* Subtasks section */}
              {todo.subtodos && todo.subtodos.length > 0 && (
                <div className="mt-4 pt-3 border-t border-green-100 dark:border-green-800">
                  <div className="flex items-center justify-between text-xs text-green-600 dark:text-green-300 mb-3">
                    <span>{t('Subtasks')}</span>
                    <span>{todo.subtodos.filter(st => st.completed).length}/{todo.subtodos.length}</span>
                  </div>
                  <div className="space-y-2">
                    {todo.subtodos.map((subtask, subIndex) => (
                      <div key={subIndex} className="flex items-center gap-2">
                        <span className={`text-sm flex-1 ${subtask.completed ? "line-through text-green-400 dark:text-green-500" : "text-green-700 dark:text-green-300"}`}>
                          {subtask.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
};

export default Completed;