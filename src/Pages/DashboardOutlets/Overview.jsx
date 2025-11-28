import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { CheckCircle, Clock, List, Circle, Trash2, MessageCircle, X, Send, User, Users } from "lucide-react";
import TodoModal from "../../Components/Modals/Todo";
import { toast } from "sonner";
import EditTodoModal from "../../Components/Modals/EditTodoModal";
import { useTranslation } from 'react-i18next';
import { useChatStore } from "../../Components/Store/useChatStore";
import ChatSideBar from "../../Components/ChatSideBar";
import ChatContainer from "../../Components/ChatContainer";
import NoChatSelected from "../../Components/NoChatSelected";
import { API_BASE_URL } from "../../lib/constants";
import { useLocation } from 'react-router-dom';
import { groupTodosByTypeAndPriority } from "../../lib/utils";

const Overview = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, currentUser, currentUserLoading } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [contributors, setContributors] = useState([]);
  const [selectedContributor, setSelectedContributor] = useState(null);
  const [contributorsEmails, setContributorsEmails] = useState('');
  const { selectedUser, subscribeToMessages, unsubscribeFromMessages, setChatOpen, markMessagesAsRead, unreadMessages } = useChatStore();
  const { socket } = useAuth();
  const location = useLocation();

  useEffect(() => {
    fetchTodos();
    fetchContributors();

    // Check if chat should be opened from URL parameter
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('chat') === 'open') {
      setIsChatOpen(true);
    }

    // Set up periodic refetch to show real-time updates for task completions
    const interval = setInterval(() => {
      fetchTodos();
    }, 30000); // refetch every 30 seconds

    return () => clearInterval(interval);
  }, [currentUser, isAuthenticated, location.search]);

  useEffect(() => {
    if (isChatOpen) {
      subscribeToMessages(socket, currentUser?._id);
      setChatOpen(true);
    } else {
      unsubscribeFromMessages(socket);
      setChatOpen(false);
    }

    return () => unsubscribeFromMessages(socket);
  }, [isChatOpen, subscribeToMessages, unsubscribeFromMessages, socket, setChatOpen, currentUser?._id]);

  const fetchTodos = async () => {
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

      // Filter todos based on user role and completion status
      const filteredTodos = uniqueTodos.filter(todo => {
        const dueDate = new Date(todo.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // If the current user is the creator/owner of the todo
        if (todo.createdBy === currentUser._id) {
          // Show all todos created by the owner (both pending and completed)
          return dueDate >= today || todo.completed;
        } else {
          // If the current user is assigned to the todo (contributor)
          // Only show if not completed (contributors shouldn't see completed todos they worked on)
          return !todo.completed && (dueDate >= today || todo.completed);
        }
      });
      setTodos(filteredTodos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      toast.error("Failed to load todos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTodos = async (newTodo) => {
    const token = localStorage.getItem("token");

    if (new Date(newTodo.dueDate) < new Date()) {
      toast.error("Due date must be today or in the future.");
      throw new Error("Due date must be today or in the future.");
    }

    try {
      const response = await axios.post(
       ` ${API_BASE_URL}/todos/api/todos`,
        newTodo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTodos((prevTodos) => [response.data, ...prevTodos]);
      toast.success("Todo added successfully!");

      // Refresh contributors list in case a new contributor was added
      fetchContributors();

      return response.data;
    } catch (error) {
      console.error("Error adding todo:", error.response?.data || error.message);
      toast.error("Failed to add todo");
      throw error;
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const [completingTodos, setCompletingTodos] = useState(new Set());
  const [updatingSubtasks, setUpdatingSubtasks] = useState(new Set());

  const toggleTodoCompletion = async (index) => {
    const todo = todos[index];
    const todoId = todo._id;

    if (completingTodos.has(todoId)) return; // Prevent double-clicks

    setCompletingTodos(prev => new Set(prev).add(todoId));

    const isAssignedToCurrentUser = todo.assignedTo === currentUser.email;
    const isCreatedByCurrentUser = todo.createdBy === currentUser._id || todo.userId === currentUser._id;

    try {
      // If the user is assigned to this todo (contributor), use the public endpoint
      if (isAssignedToCurrentUser && !isCreatedByCurrentUser) {
        const response = await axios.put(
          `${API_BASE_URL}/todos/api/public-todos/${todo._id}/complete`,
          { email: currentUser.email }
        );

        setTodos((prevTodos) =>
          prevTodos.map((t) =>
            t._id === response.data._id ? response.data : t
          )
        );
        toast.success("Task marked as completed!");
      } else {
        // If the user created this todo (owner), use the authenticated endpoint
        const updatedTodos = [...todos];
        updatedTodos[index].completed = !updatedTodos[index].completed;

        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.put(
          `${API_BASE_URL}/todos/api/todos/${updatedTodos[index]._id}`,
          updatedTodos[index],
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo._id === response.data._id ? response.data : todo
          )
        );
      }
    } catch (error) {
      console.error("Error updating todo:", error);
      toast.error("Failed to update task");
    } finally {
      setCompletingTodos(prev => {
        const newSet = new Set(prev);
        newSet.delete(todoId);
        return newSet;
      });
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
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== todoId));
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

      setTodos((prevTodos) =>
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
    const subtaskKey = `${todoId}-${subtaskIndex}`;

    if (updatingSubtasks.has(subtaskKey)) return; // Prevent double-clicks

    setUpdatingSubtasks(prev => new Set(prev).add(subtaskKey));

    const todo = todos.find(todo => todo._id === todoId);
    if (!todo) return;

    const isAssignedToCurrentUser = todo.assignedTo === currentUser.email;
    const isCreatedByCurrentUser = todo.createdBy === currentUser._id || todo.userId === currentUser._id;

    try {
      // If the user is assigned to this todo (contributor), use the public endpoint
      if (isAssignedToCurrentUser && !isCreatedByCurrentUser) {
        const response = await axios.put(
          `${API_BASE_URL}/todos/api/public-todos/${todoId}/subtask`,
          {
            subtaskIndex,
            email: currentUser.email
          }
        );

        setTodos((prevTodos) =>
          prevTodos.map((t) =>
            t._id === response.data._id ? response.data : t
          )
        );
      } else {
        // If the user created this todo (owner), use the authenticated endpoint
        const token = localStorage.getItem("token");
        if (!token) return;

        const updatedSubtodos = [...todo.subtodos];
        updatedSubtodos[subtaskIndex].completed = !updatedSubtodos[subtaskIndex].completed;

        const response = await axios.put(
          `${API_BASE_URL}/todos/api/todos/${todoId}`,
          {
            ...todo,
            subtodos: updatedSubtodos
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo._id === response.data._id ? response.data : todo
          )
        );
      }
    } catch (error) {
      console.error("Error updating subtask:", error);
      toast.error("Failed to update subtask");
    } finally {
      setUpdatingSubtasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(subtaskKey);
        return newSet;
      });
    }
  };

  const fetchContributors = async () => {
    if (currentUserLoading || !isAuthenticated || !currentUser?._id) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Fetch project contributors directly from the API
      const response = await axios.get(
        `${API_BASE_URL}/projects/api/project-contributors/${currentUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Ensure we have an array and filter out the current user
      const contributorsData = Array.isArray(response.data) ? response.data : [];
      const projectContributors = contributorsData.filter(user => user._id && user._id !== currentUser._id);

      console.log("Project contributors found:", projectContributors);
      setContributors(projectContributors);
    } catch (error) {
      console.error("Error fetching contributors:", error);
      toast.error("Failed to load contributors");
    }
  };

  const getContributorsEmails = () => {
    if (contributors.length === 0) {
      toast.error("No contributors found");
      return;
    }

    const emails = contributors.map(contributor => contributor.email).join(', ');
    setContributorsEmails(emails);
    toast.success("Contributors emails copied to clipboard");
    navigator.clipboard.writeText(emails);
  };



  const priorityOrder = { high: 0, medium: 1, low: 2 };
  
  const sortedTodos = todos.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return (priorityOrder[a.priority] || 999) - (priorityOrder[b.priority] || 999);
  });

  const remainingTodos = sortedTodos.filter((todo) => !todo.completed);
  const completedTodosList = sortedTodos.filter((todo) => todo.completed);

  const personalTodos = remainingTodos.filter((todo) => todo.taskType === 'personal');
  const groupTodos = remainingTodos.filter((todo) => todo.taskType === 'project');

  return (
    <div className="w-full space-y-8 relative">


      {/* Chat Box */}
      {isChatOpen && (
        <div className="fixed right-4 bottom-4 z-50 w-[400px] h-[80vh] bg-card rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden">
          {/* Chat Header - only show when not in chat mode */}
          {!selectedContributor && (
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-base-100 to-base-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground text-lg">
                    Chat with Contributors
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Team Communication
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="w-8 h-8 hover:bg-muted rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {!selectedContributor ? (
              /* Contributors List */
              <>
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-3">
                    <h4 className="font-medium text-card-foreground mb-4">Select a contributor to chat with:</h4>
                    {contributors.map((contributor, index) => (
                      <button
                        key={contributor._id || index}
                        onClick={() => {
                          // Only allow selecting contributors with valid user IDs
                          if (contributor._id && typeof contributor._id === 'string' && contributor._id.length > 10) {
                            setSelectedContributor(contributor);
                            // Set the selected user in chat store for messaging
                            useChatStore.getState().setSelectedUser(contributor);
                            useChatStore.getState().clearMessages();
                            useChatStore.getState().getMessages(contributor.email);
                          } else {
                            toast.error('Cannot chat with this contributor - user not found');
                          }
                        }}
                        className={`w-full p-4 text-left hover:bg-muted rounded-xl transition-all duration-200 border border-transparent hover:border-primary/20 ${
                          selectedContributor?._id === contributor._id ? 'bg-primary/10 border-primary/30' : ''
                        } ${!(contributor._id && typeof contributor._id === 'string' && contributor._id.length > 10) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-focus rounded-full flex items-center justify-center shadow-md">
                            <span className="text-sm font-semibold text-primary-foreground">
                              {(contributor.name || contributor.email || 'U').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-card-foreground block truncate">
                              {contributor.name || contributor.email}
                            </span>
                            <p className="text-xs text-muted-foreground truncate">{contributor.email}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                    {contributors.length === 0 && (
                      <div className="text-center py-8">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          No contributors found. Create projects and invite team members to start chatting.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-border bg-base-100">
                  <button
                    onClick={getContributorsEmails}
                    className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium shadow-lg hover:shadow-xl"
                  >
                    Get Contributors Emails
                  </button>
                  {contributorsEmails && (
                    <div className="mt-3 p-3 bg-muted rounded-lg text-sm border">
                      <p className="font-medium mb-1">Emails copied:</p>
                      <p className="text-muted-foreground break-all">{contributorsEmails}</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Chat Interface */
              <>
                <div className="flex-1 flex flex-col min-h-0">
                  <ChatContainer />
                </div>

                {/* Back to list button */}
                <div className="p-3 border-t border-border bg-base-100">
                  <button
                    onClick={() => {
                      setSelectedContributor(null);
                      useChatStore.getState().setSelectedUser(null);
                    }}
                    className="w-full px-4 py-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors text-sm font-medium"
                  >
                    ← Back to contributors list
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('Overview')}</h1>
          <p className="text-muted-foreground mt-1">Manage and track your tasks efficiently</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <span>+</span>
          {t('Add Todo')}
        </button>
      </div>

      <TodoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddTodos={handleAddTodos}
      />
      <EditTodoModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        todo={currentTodo}
        onEditTodo={editTodo}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('Pending')}</p>
              <p className="text-3xl font-bold text-card-foreground mt-1">{remainingTodos.length}</p>
            </div>
        <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
          <Clock size={24} className="text-yellow-600 dark:text-yellow-400" />
        </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('Completed')}</p>
              <p className="text-3xl font-bold text-card-foreground mt-1">{completedTodosList.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl shadow-lg border border-border hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
              <p className="text-3xl font-bold text-card-foreground mt-1">{todos.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <List size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
        <h3 className="text-2xl font-bold text-card-foreground mb-6">{t('Your Tasks')}</h3>
        {todos.length === 0 ? (
          <div className="py-12 text-center">
            <List className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
            <p className="text-muted-foreground">{t('No tasks available')}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {(() => {
              const grouped = groupTodosByTypeAndPriority(todos);
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
                          <OverviewTodoCard
                            key={todo._id}
                            todo={todo}
                            canComplete={!todo.subtodos || todo.subtodos.every(st => st.completed)}
                            onToggleCompletion={toggleTodoCompletion}
                            onToggleSubtaskCompletion={toggleSubtaskCompletion}
                            onOpenEditModal={handleOpenEditModal}
                            onDeleteTodo={handleDeleteTodo}
                            completingTodos={completingTodos}
                            updatingSubtasks={updatingSubtasks}
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
                          <OverviewTodoCard
                            key={todo._id}
                            todo={todo}
                            canComplete={!todo.subtodos || todo.subtodos.every(st => st.completed)}
                            onToggleCompletion={toggleTodoCompletion}
                            onToggleSubtaskCompletion={toggleSubtaskCompletion}
                            onOpenEditModal={handleOpenEditModal}
                            onDeleteTodo={handleDeleteTodo}
                            completingTodos={completingTodos}
                            updatingSubtasks={updatingSubtasks}
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

const OverviewTodoCard = ({ todo, canComplete, onToggleCompletion, onToggleSubtaskCompletion, onOpenEditModal, onDeleteTodo, completingTodos, updatingSubtasks, t }) => {
  return (
    <div
      onClick={() => {
        window.location.href = `/todo/${todo._id}?email=${todo.assignedTo || todo.createdBy}`;
      }}
      className={`group relative p-6 rounded-2xl transition-all duration-300 border-2 hover:shadow-xl hover:scale-[1.02] cursor-pointer ${
        todo.completed
          ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-300"
          : "bg-card border-border hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50"
        }`}
    >
      <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${todo.priority === "high" ? "bg-red-500" : todo.priority === "medium" ? "bg-yellow-500" : "bg-green-500"}`}>
      </div>

      <div className="flex items-start justify-between mb-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!canComplete) {
              alert('Complete all subtasks before marking the todo as complete');
              return;
            }
            onToggleCompletion(todo);
          }}
          disabled={completingTodos.has(todo._id)}
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200
            ${todo.completed
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
            } ${completingTodos.has(todo._id) ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {completingTodos.has(todo._id) ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : todo.completed ? (
            <CheckCircle className="w-5 h-5" />
          ) : null}
        </button>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenEditModal(todo);
            }}
            className="p-2 text-primary hover:bg-primary/10 dark:hover:bg-primary/20 rounded-lg transition-colors"
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
            className="p-2 text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className={`font-bold text-lg leading-tight
          ${todo.completed ? "text-green-800 line-through" : "text-card-foreground"}`}>
          {todo.title}
        </h4>

        {todo.description && (
          <p className={`text-sm leading-relaxed
            ${todo.completed ? "text-green-600 line-through" : "text-muted-foreground"}`}>
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
              ${todo.priority === "high" ? "bg-red-500" :
                todo.priority === "medium" ? "bg-yellow-500" : "bg-green-500"}`}>
              {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
            </span>
          )}
        </div>
      </div>

      {todo.subtodos && todo.subtodos.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <span>Subtasks</span>
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
                  disabled={updatingSubtasks.has(`${todo._id}-${subIndex}`)}
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

export default Overview;