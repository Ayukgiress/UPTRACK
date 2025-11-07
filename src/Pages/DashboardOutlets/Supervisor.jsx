import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Pages/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { UserCheck, Mail, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from '../../lib/constants';

const Supervisor = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [assignedTodos, setAssignedTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchAssignedTodos();
    }
  }, [currentUser]);

  const fetchAssignedTodos = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/todos/api/todos/assigned/${currentUser.email}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setAssignedTodos(response.data);
    } catch (error) {
      console.error('Error fetching assigned todos:', error);
      toast.error('Failed to load assigned todos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewTodo = (todoId) => {
    // Navigate to the supervisor todo detail page
    window.open(`/supervisor/todos/${todoId}?email=${encodeURIComponent(currentUser.email)}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('Supervisor Dashboard')}</h1>
        <p className="text-muted-foreground">{t('Manage todos assigned to you for review')}</p>
      </div>

      {assignedTodos.length === 0 ? (
        <div className="text-center py-12">
          <UserCheck className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">{t('No Assigned Todos')}</h3>
          <p className="text-muted-foreground">{t('You don\'t have any todos assigned for review yet.')}</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assignedTodos.map((todo) => (
            <div key={todo._id} className="bg-card rounded-xl shadow-lg border border-border p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-card-foreground mb-2 line-clamp-2">
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
                      {todo.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {todo.priority && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${todo.priority === "high" ? "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400" :
                      todo.priority === "medium" ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400" :
                      "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"}`}>
                    {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                  </span>
                )}
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                  ${todo.completed ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"}`}>
                  {todo.completed ? t('Completed') : t('Pending')}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>{t('Created by')}: {todo.createdBy || t('Unknown')}</span>
                {todo.dueDate && (
                  <span>{t('Due')}: {new Date(todo.dueDate).toLocaleDateString()}</span>
                )}
              </div>

              <button
                onClick={() => handleViewTodo(todo._id)}
                className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Eye size={16} />
                {t('View Details')}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Supervisor;
