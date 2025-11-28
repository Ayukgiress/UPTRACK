import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { ArrowLeft, FolderOpen, Users, CheckCircle, Clock, Plus, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TodoModal from '../Components/Modals/Todo';
import { API_BASE_URL } from '../lib/constants';
import { groupTodosByTypeAndPriority } from '../lib/utils';

const ProjectDetail = () => {
  const { t } = useTranslation();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [project, setProject] = useState(null);
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser && projectId) {
      fetchProjectDetails();
      fetchProjectTodos();
    }
  }, [currentUser, projectId]);

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/projects/api/projects/${projectId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setProject(response.data);
    } catch (error) {
      console.error('Error fetching project details:', error);
      toast.error('Failed to load project details');
    }
  };

  const fetchProjectTodos = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/todos/api/todos/project/${projectId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching project todos:', error);
      toast.error('Failed to load project todos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTodos = async (todoData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/todos/api/todos`,
        todoData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setTodos(prev => [response.data, ...prev]);
      toast.success('Todo added successfully!');
      setIsTodoModalOpen(false);
    } catch (error) {
      console.error('Error adding todo:', error);
      toast.error('Failed to add todo');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <FolderOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold text-muted-foreground mb-2">Project not found</h3>
        <p className="text-muted-foreground">The project you're looking for doesn't exist or you don't have access to it.</p>
      </div>
    );
  }

  const completedTodos = todos.filter(todo => todo.completed);
  const pendingTodos = todos.filter(todo => !todo.completed);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/projects')}
            className="p-2 hover:bg-muted rounded-xl transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
            <p className="text-muted-foreground mt-1">{project.description}</p>
          </div>
        </div>
        <button
          onClick={() => setIsTodoModalOpen(true)}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Plus size={20} />
          Add Task
        </button>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contributors</p>
              <p className="text-2xl font-bold text-foreground">{(project.contributors?.length || 0) + 1}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed Tasks</p>
              <p className="text-2xl font-bold text-foreground">{completedTodos.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Tasks</p>
              <p className="text-2xl font-bold text-foreground">{pendingTodos.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Sections */}
      <div className="space-y-8">
        {/* Pending Tasks */}
        {pendingTodos.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <h3 className="text-xl font-semibold text-card-foreground">Pending Tasks</h3>
              <span className="text-sm text-muted-foreground">({pendingTodos.length})</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {(() => {
                const grouped = groupTodosByTypeAndPriority(pendingTodos);
                return (
                  <>
                    {grouped.personal.length > 0 && (
                      <div className="col-span-full">
                        <div className="flex items-center gap-2 mb-4 ml-4">
                          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <h4 className="text-sm font-medium text-muted-foreground">Personal Tasks</h4>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                          {grouped.personal.map((todo) => (
                            <ProjectTodoCard key={todo._id} todo={todo} />
                          ))}
                        </div>
                      </div>
                    )}
                    {grouped.group.length > 0 && (
                      <div className="col-span-full">
                        <div className="flex items-center gap-2 mb-4 ml-4">
                          <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <h4 className="text-sm font-medium text-muted-foreground">Group Tasks</h4>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                          {grouped.group.map((todo) => (
                            <ProjectTodoCard key={todo._id} todo={todo} />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {completedTodos.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 className="text-xl font-semibold text-card-foreground">Completed Tasks</h3>
              <span className="text-sm text-muted-foreground">({completedTodos.length})</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {(() => {
                const grouped = groupTodosByTypeAndPriority(completedTodos);
                return (
                  <>
                    {grouped.personal.length > 0 && (
                      <div className="col-span-full">
                        <div className="flex items-center gap-2 mb-4 ml-4">
                          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <h4 className="text-sm font-medium text-muted-foreground">Personal Tasks</h4>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                          {grouped.personal.map((todo) => (
                            <ProjectTodoCard key={todo._id} todo={todo} />
                          ))}
                        </div>
                      </div>
                    )}
                    {grouped.group.length > 0 && (
                      <div className="col-span-full">
                        <div className="flex items-center gap-2 mb-4 ml-4">
                          <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <h4 className="text-sm font-medium text-muted-foreground">Group Tasks</h4>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                          {grouped.group.map((todo) => (
                            <ProjectTodoCard key={todo._id} todo={todo} />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* No Tasks */}
        {todos.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No tasks yet</h3>
            <p className="text-muted-foreground mb-6">Create your first task for this project to get started.</p>
            <button
              onClick={() => setIsTodoModalOpen(true)}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Create First Task
            </button>
          </div>
        )}
      </div>

      <TodoModal
        isOpen={isTodoModalOpen}
        onClose={() => setIsTodoModalOpen(false)}
        onAddTodos={handleAddTodos}
        defaultProjectId={projectId}
      />
    </div>
  );
};

const ProjectTodoCard = ({ todo }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(`/todo/${todo._id}?email=${todo.assignedTo || todo.createdBy}`);
      }}
      className="group relative p-6 rounded-2xl transition-all duration-300 border-2 bg-card border-border hover:border-primary/50 hover:shadow-2xl hover:scale-[1.02] cursor-pointer"
    >
      <div className={`absolute top-4 right-4 w-3 h-3 rounded-full
        ${todo.priority === "high" ? "bg-red-500" :
          todo.priority === "medium" ? "bg-yellow-500" : "bg-green-500"}`}>
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          {todo.completed ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <Clock className="w-5 h-5 text-primary" />
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h4 className={`font-bold text-lg leading-tight ${todo.completed ? 'line-through text-muted-foreground' : 'text-card-foreground'}`}>
          {todo.title}
        </h4>

        {todo.description && (
          <p className={`text-sm leading-relaxed ${todo.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
            {todo.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {todo.dueDate && (
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{new Date(todo.dueDate).toLocaleDateString()}</span>
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
    </div>
  );
};

export default ProjectDetail;
