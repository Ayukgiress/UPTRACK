import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../Pages/AuthContext';

const EditTodoModal = ({ isOpen, onClose, todo, onEditTodo }) => {
  const { currentUser } = useAuth();
  const [editedTodo, setEditedTodo] = useState(getInitialTodoState());
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

  useEffect(() => {
    if (isOpen && currentUser) {
      fetchProjects();
    }
  }, [isOpen, currentUser]);

  useEffect(() => {
    if (todo && isOpen) {
      // Pre-fill all fields from the existing todo
      setEditedTodo({
        title: todo.title || '',
        description: todo.description || '',
        subtodos: todo.subtodos || [],
        priority: todo.priority || 'medium',
        dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '',
      });

      // Determine task type based on existing data
      if (todo.projectId) {
        setTaskType('project');
        setSelectedProject(todo.projectId);
        setAssignedTo(todo.assignedTo || '');
      } else if (todo.taskType === 'personal' || todo.assignedTo) {
        setTaskType('personal');
        setSupervisorEmail(todo.assignedTo || '');
      }

      // Clear errors when opening modal
      setErrors({});
    }
  }, [todo, isOpen]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/projects/api/projects/${currentUser._id}`,
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

    if (!editedTodo.title.trim()) {
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

    if (editedTodo.dueDate && new Date(editedTodo.dueDate) < new Date()) {
      newErrors.dueDate = 'Due date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setEditedTodo(prev => ({
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
    setEditedTodo(prev => ({
      ...prev,
      subtodos: [...prev.subtodos, { title: '', completed: false }]
    }));
  };

  const updateSubtask = (index, value) => {
    const newSubtodos = [...editedTodo.subtodos];
    newSubtodos[index].title = value;
    setEditedTodo(prev => ({ ...prev, subtodos: newSubtodos }));
  };

  const removeSubtask = (index) => {
    const newSubtodos = editedTodo.subtodos.filter((_, i) => i !== index);
    setEditedTodo(prev => ({ ...prev, subtodos: newSubtodos }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const cleanedTodo = {
          ...todo, // Keep original todo data
          ...editedTodo, // Override with edited fields
          title: editedTodo.title.trim(),
          description: editedTodo.description.trim(),
          subtodos: editedTodo.subtodos
            .map(sub => ({ ...sub, title: sub.title.trim() }))
            .filter(sub => sub.title !== ''),
          assignedTo: taskType === 'personal' ? supervisorEmail.trim().toLowerCase() : assignedTo.trim().toLowerCase(),
          projectId: taskType === 'project' ? selectedProject : null,
          taskType: taskType, // 'project' or 'personal'
        };

        await onEditTodo(cleanedTodo);

        toast.success('Todo updated successfully!');

        onClose();
      } catch (error) {
        toast.error('Failed to update todo. Please try again.');
        console.error('Todo update error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Todo</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Task Type</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="project"
                  checked={taskType === 'project'}
                  onChange={(e) => handleTaskTypeChange(e.target.value)}
                  className="mr-2"
                />
                Project Task
              </label>
              <label className="flex items-center">
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
                  value={editedTodo.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`border rounded-lg p-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  placeholder="Enter todo title"
                />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <textarea
            value={editedTodo.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full min-h-[100px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Enter todo description (optional)"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Priority</label>
              <select
                value={editedTodo.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Due Date</label>
              <input
                type="date"
                value={editedTodo.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className={`border rounded-lg p-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors.dueDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              />
              {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
            </div>


          </div>

          {taskType === 'project' && (
            <>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Project *</label>
                <select
                  value={selectedProject}
                  onChange={(e) => handleProjectChange(e.target.value)}
                  className={`border rounded-lg p-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors.project ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                {errors.project && <p className="text-red-500 text-sm mt-1">{errors.project}</p>}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Assign to Contributor *
                </label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className={`border rounded-lg p-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors.assignedTo ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                >
                  <option value="">Select a contributor</option>
                  {contributors.map((contributor) => (
                    <option key={contributor._id || contributor.email} value={contributor.email}>
                      {contributor.name || contributor.email}
                    </option>
                  ))}
                </select>
                {errors.assignedTo && <p className="text-red-500 text-sm mt-1">{errors.assignedTo}</p>}
              </div>
            </>
          )}

          {taskType === 'personal' && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Supervisor Email *</label>
              <input
                type="email"
                value={supervisorEmail}
                onChange={(e) => setSupervisorEmail(e.target.value)}
                className={`border rounded-lg p-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${errors.supervisorEmail ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                placeholder="Enter supervisor email for invitation"
              />
              {errors.supervisorEmail && <p className="text-red-500 text-sm mt-1">{errors.supervisorEmail}</p>}
              <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  <strong>Personal Task:</strong> This task will be assigned to the specified supervisor email for review and management.
                </p>
              </div>
            </div>
          )}

          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-semibold text-gray-900 dark:text-white">Subtasks</h3>
              <button
                type="button"
                onClick={addSubtask}
                className="text-blue-500 hover:text-blue-600 flex items-center"
              >
                <Plus size={16} className="mr-1" /> Add Subtask
              </button>
            </div>
            {editedTodo.subtodos.map((subtask, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={subtask.title}
                  onChange={(e) => updateSubtask(index, e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 flex-grow bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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

          <div className="flex justify-between gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTodoModal;
