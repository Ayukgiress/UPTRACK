import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../Pages/AuthContext';
import { API_BASE_URL } from '../../lib/constants';

const TodoModal = ({ isOpen, onClose, onAddTodos }) => {
  const { currentUser } = useAuth();
  const [todo, setTodo] = useState(getInitialTodoState());
  const [errors, setErrors] = useState({});
  const [assignedTo, setAssignedTo] = useState('');
  const [supervisorEmail, setSupervisorEmail] = useState('');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [contributors, setContributors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskType, setTaskType] = useState('project'); // 'project' or 'personal'

  function getInitialTodoState() {
    return {
      title: '',
      description: '',
      subtodos: [],
      priority: 'medium',
      dueDate: '',
    };
  }

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (isOpen && currentUser) {
      fetchProjects();
    }
  }, [isOpen, currentUser]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/projects/api/projects/${currentUser._id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleProjectChange = (projectId) => {
    setSelectedProject(projectId);
    setAssignedTo('');

    if (projectId) {
      // Find the selected project from the already fetched projects list
      const selectedProjectData = projects.find(project => project._id === projectId);
      // Include the owner (current user) as the first contributor
      const projectContributors = selectedProjectData?.contributors || [];
      setContributors([currentUser, ...projectContributors]);
    } else {
      setContributors([]);
    }
  };

  const handleTaskTypeChange = (type) => {
    setTaskType(type);
    setSelectedProject('');
    setAssignedTo('');
    setSupervisorEmail('');
    setContributors([]);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!todo.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (taskType === 'project') {
      if (!selectedProject) {
        newErrors.project = 'Project selection is required';
      }

      if (!assignedTo) {
        newErrors.assignedTo = 'Contributor assignment is required';
      }
    } else if (taskType === 'personal') {
      if (!supervisorEmail.trim()) {
        newErrors.supervisorEmail = 'Supervisor email is required for personal tasks';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(supervisorEmail.trim())) {
          newErrors.supervisorEmail = 'Please enter a valid email address';
        }
      }
    }

    if (todo.dueDate && new Date(todo.dueDate) < new Date()) {
      newErrors.dueDate = 'Due date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setTodo(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const addSubtask = () => {
    setTodo(prev => ({
      ...prev,
      subtodos: [...prev.subtodos, { title: '', completed: false }]
    }));
  };

  const updateSubtask = (index, value) => {
    const newSubtodos = [...todo.subtodos];
    newSubtodos[index].title = value;
    setTodo(prev => ({ ...prev, subtodos: newSubtodos }));
  };

  const removeSubtask = (index) => {
    const newSubtodos = todo.subtodos.filter((_, i) => i !== index);
    setTodo(prev => ({ ...prev, subtodos: newSubtodos }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const cleanedTodo = {
          ...todo,
          title: todo.title.trim(),
          description: todo.description.trim(),
          subtodos: todo.subtodos
            .map(sub => ({ ...sub, title: sub.title.trim() }))
            .filter(sub => sub.title !== ''),
          completed: false,
          assignedTo: taskType === 'personal' ? supervisorEmail.trim().toLowerCase() : assignedTo.trim().toLowerCase(),
          projectId: taskType === 'project' ? selectedProject : null,
          taskType: taskType, // 'project' or 'personal'
          createdBy: currentUser._id
        };

        await onAddTodos(cleanedTodo);

        toast.success('Todo added successfully!');

        setTodo(getInitialTodoState());
        setAssignedTo('');
        setSupervisorEmail('');
        setSelectedProject('');
        setContributors([]);
        setTaskType('project');
        onClose();
      } catch (error) {
        // Error is already handled in onAddTodos, so we don't need to show another toast
        console.error('Todo creation error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <div className="bg-card rounded-2xl p-8 w-full max-w-md shadow-2xl border border-border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-card-foreground">Add New Todo</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-2 rounded-lg hover:bg-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900">Task Type</label>
            <div className="flex gap-4">
              <label className="flex items-center text-gray-900">
                <input
                  type="radio"
                  value="project"
                  checked={taskType === 'project'}
                  onChange={(e) => handleTaskTypeChange(e.target.value)}
                  className="mr-2"
                />
                Project Task
              </label>
              <label className="flex items-center text-gray-900">
                <input
                  type="radio"
                  value="personal"
                  checked={taskType === 'personal'}
                  onChange={(e) => handleTaskTypeChange(e.target.value)}
                  className="mr-2"
                />
                Personal Task
              </label>
            </div>
          </div>

          <div>
            <input
              type="text"
              value={todo.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`border rounded-xl px-4 py-3 w-full bg-background text-foreground placeholder-muted-foreground font-medium transition-all duration-200 ${errors.title ? 'border-destructive focus:ring-destructive' : 'border-input hover:border-ring focus:border-ring'} focus:outline-none focus:ring-2 focus:ring-ring/20`}
              placeholder="Enter todo title"
            />
            {errors.title && <p className="text-destructive text-sm mt-2">{errors.title}</p>}
          </div>

          <textarea
            value={todo.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="border border-input rounded-xl px-4 py-3 w-full min-h-[100px] bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all duration-200 resize-none"
            placeholder="Enter todo description (optional)"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Priority</label>
              <select
                value={todo.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Due Date</label>
              <input
                type="date"
                value={todo.dueDate}
                min={getMinDate()}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className={`border rounded-lg p-2 w-full bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.dueDate ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
            </div>
          </div>

          {taskType === 'project' && (
            <>
              <div className="mt-6">
                <label className="block text-sm font-semibold mb-3 text-card-foreground">Project *</label>
                <select
                  value={selectedProject}
                  onChange={(e) => handleProjectChange(e.target.value)}
                  className={`border rounded-xl px-4 py-3 w-full bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all duration-200 ${errors.project ? 'border-destructive focus:ring-destructive' : 'border-input hover:border-ring'}`}
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                {errors.project && <p className="text-destructive text-sm mt-2">{errors.project}</p>}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold mb-3 text-card-foreground">
                  Assign to Contributor *
                </label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className={`border rounded-xl px-4 py-3 w-full bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all duration-200 ${errors.assignedTo ? 'border-destructive focus:ring-destructive' : 'border-input hover:border-ring'}`}
                >
                  <option value="">Select a contributor</option>
                  {contributors.map((contributor) => (
                    <option key={contributor._id || contributor.email} value={contributor.email}>
                      {contributor.name || contributor.email}
                    </option>
                  ))}
                </select>
                {errors.assignedTo && <p className="text-destructive text-sm mt-2">{errors.assignedTo}</p>}
              </div>
            </>
          )}

          {taskType === 'personal' && (
            <div className="mt-6">
              <label className="block text-sm font-semibold mb-3 text-card-foreground">Supervisor Email *</label>
              <input
                type="email"
                value={supervisorEmail}
                onChange={(e) => setSupervisorEmail(e.target.value)}
                className={`border rounded-xl px-4 py-3 w-full bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-all duration-200 ${errors.supervisorEmail ? 'border-destructive focus:ring-destructive' : 'border-input hover:border-ring'}`}
                placeholder="Enter supervisor email for invitation"
              />
              {errors.supervisorEmail && <p className="text-destructive text-sm mt-2">{errors.supervisorEmail}</p>}
              <div className="mt-4 p-4 bg-muted/50 border border-border rounded-xl">
                <p className="text-sm text-muted-foreground">
                  <strong>Personal Task:</strong> This task will be assigned to the specified supervisor email for review and management.
                </p>
              </div>
            </div>
          )}

          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-semibold text-gray-900">Subtasks</h3>
              <button
                type="button"
                onClick={addSubtask}
                className="text-blue-500 hover:text-blue-600 flex items-center"
              >
                <Plus size={16} className="mr-1" /> Add Subtask
              </button>
            </div>
            {todo.subtodos.map((subtask, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={subtask.title}
                  onChange={(e) => updateSubtask(index, e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 flex-grow bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Subtask ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeSubtask(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}

          <div className="flex justify-end gap-3 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
              )}
              {isSubmitting ? 'Adding...' : 'Add Todo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoModal;