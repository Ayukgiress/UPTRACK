import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { Clock, Circle, Trash2, Users, User } from "lucide-react";
import { toast } from "sonner";
import EditTodoModal from "../../Components/Modals/EditTodoModal";
import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from "../../lib/constants";
import { groupTodosByTypeAndPriority } from "../../lib/utils";

const Pending = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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

      const pending = uniqueTodos.filter(todo => !todo.completed);
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
        `${API_BASE_URL}/todos/api/todos/${todo._id}`,
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
      await axios.delete(`${API_BASE_URL}/todos/api/todos/${todoId}`, {
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
        `${API_BASE_URL}/todos/api/todos/edit/${updatedTodo._id}`,
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

  const toggleSubtaskCompletion = async (todoId, subtaskIndex) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const todoToUpdate = pendingTodos.find(todo => todo._id === todoId);
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

      setPendingTodos((prevTodos) =>
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
        <p className="text-gray-500">Loading pending todos...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
          <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('Pending')}</h1>
            <p className="text-muted-foreground mt-1">{t('Tasks waiting to be completed')}</p>
          </div>
        </div>
        <div className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-xl font-medium">
          {pendingTodos.length} {t('pending')}
        </div>
      </div>

      <EditTodoModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        todo={currentTodo}
        onEditTodo={editTodo}
      />

      <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
        {pendingTodos.length === 0 ? (
          <div className="py-12">
            <Clock className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">{t('No pending tasks')}</h3>
            <p className="text-muted-foreground">{t('All caught up! Great job staying on top of your tasks.')}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {(() => {
              const grouped = groupTodosByTypeAndPriority(pendingTodos);
              return (
                <>
                  {grouped.personal.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-lg font-semibold text-card-foreground">Personal Tasks</h3>
                        <span className="text-xs text-muted-foreground">({grouped.personal.length})</span>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {grouped.personal.map((todo) => (
                          <TodoCard
                            key={todo._id}
                            todo={todo}
                            canComplete={!todo.subtodos || todo.subtodos.every(st => st.completed)}
                            onToggleCompletion={toggleTodoCompletion}
                            onToggleSubtaskCompletion={toggleSubtaskCompletion}
                            onOpenEditModal={handleOpenEditModal}
                            onDeleteTodo={handleDeleteTodo}
                            t={t}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {grouped.group.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <h3 className="text-lg font-semibold text-card-foreground">Group Tasks</h3>
                        <span className="text-xs text-muted-foreground">({grouped.group.length})</span>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {grouped.group.map((todo) => (
                          <TodoCard
                            key={todo._id}
                            todo={todo}
                            canComplete={!todo.subtodos || todo.subtodos.every(st => st.completed)}
                            onToggleCompletion={toggleTodoCompletion}
                            onToggleSubtaskCompletion={toggleSubtaskCompletion}
                            onOpenEditModal={handleOpenEditModal}
                            onDeleteTodo={handleDeleteTodo}
                            t={t}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

const TodoCard = ({ todo, canComplete, onToggleCompletion, onToggleSubtaskCompletion, onOpenEditModal, onDeleteTodo, t }) => {
  return (
    <div
      onClick={() => {
        navigate(`/todo/${todo._id}?email=${todo.assignedTo || todo.createdBy}`);
      }}
      className="group relative p-6 rounded-2xl transition-all duration-300 border-2 bg-card border-border hover:border-primary/50 hover:shadow-2xl hover:scale-[1.02] cursor-pointer"
    >
      <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${todo.priority === "high" ? "bg-red-500" : todo.priority === "medium" ? "bg-yellow-500" : "bg-green-500"}`}>
      </div>

      <div className="flex items-start justify-between mb-6">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!canComplete) {
              alert('Complete all subtasks before marking the todo as complete');
              return;
            }
            onToggleCompletion(todo);
          }}
          className="w-10 h-10 rounded-full border-2 border-border hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center justify-center transition-all duration-200 shadow-md"
        >
          <Circle className="w-5 h-5" />
        </button>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenEditModal(todo);
            }}
            className="p-2 text-primary hover:bg-primary/10 dark:hover:bg-primary/20 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTodo(todo._id);
            }}
            className="p-2 text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-bold text-lg leading-tight text-card-foreground">
          {todo.title}
        </h4>

        {todo.description && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {todo.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {todo.dueDate && (
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{new Date(todo.dueDate).toLocaleDateString()}</span>
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

          {todo.priority && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white
              ${todo.priority === "high" ? "bg-red-500 dark:bg-red-600" :
                todo.priority === "medium" ? "bg-yellow-500 dark:bg-yellow-600" : "bg-green-500 dark:bg-green-600"}`}>
              {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
            </span>
          )}
        </div>
      </div>

      {todo.subtodos && todo.subtodos.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <span>{t('Subtasks')}</span>
            <span>{todo.subtodos.filter(st => st.completed).length}/{todo.subtodos.length}</span>
          </div>
          <div className="space-y-2">
            {todo.subtodos.map((subtask, subIndex) => (
              <div key={subIndex} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={(e) => {
                    e.stopPropagation();
                    onToggleSubtaskCompletion(todo._id, subIndex);
                  }}
                  className="w-4 h-4 text-primary border-border focus:ring-primary focus:ring-2"
                />
                <span className={`text-sm flex-1 ${subtask.completed ? "line-through text-muted-foreground" : "text-card-foreground"}`}>
                  {subtask.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pending;