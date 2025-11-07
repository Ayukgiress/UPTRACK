import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../Pages/AuthContext';

const TodoModal = ({ isOpen, onClose, onAddTodos }) => {
  const { currentUser } = useAuth();
  const [todo, setTodo] = useState(getInitialTodoState());
  const [errors, setErrors] = useState({});
  const [assignedTo, setAssignedTo] = useState('');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [contributors, setContributors] = useState([]);

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

  const validateForm = () => {
    const newErrors = {};

    if (!todo.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!selectedProject) {
      newErrors.project = 'Project selection is required';
    }

    if (!assignedTo) {
      newErrors.assignedTo = 'Contributor assignment is required';
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
      try {
        const cleanedTodo = {
          ...todo,
          title: todo.title.trim(),
          description: todo.description.trim(),
          subtodos: todo.subtodos
            .map(sub => ({ ...sub, title: sub.title.trim() }))
            .filter(sub => sub.title !== ''),
          completed: false,
          assignedTo: assignedTo.trim(),
          projectId: selectedProject || null
        };

        await onAddTodos(cleanedTodo);
        
        toast.success('Todo added successfully!');
        
        setTodo(getInitialTodoState());
        setAssignedTo('');
        setSelectedProject('');
        setContributors([]);
        onClose();
      } catch (error) {
        toast.error('Failed to add todo. Please try again.');
        console.error('Todo creation error:', error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Todo</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={todo.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`border rounded-lg p-2 w-full ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter todo title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <textarea
            value={todo.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full min-h-[100px]"
            placeholder="Enter todo description (optional)"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={todo.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="border rounded-lg p-2 w-full"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Due Date</label>
              <input
                type="date"
                value={todo.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className={`border rounded-lg p-2 w-full ${errors.dueDate ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
            </div>

            
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Project *</label>
            <select
              value={selectedProject}
              onChange={(e) => handleProjectChange(e.target.value)}
              className={`border rounded-lg p-2 w-full ${errors.project ? 'border-red-500' : 'border-gray-300'}`}
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
            <label className="block text-sm font-medium mb-2">
              Assign to Contributor *
            </label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className={`border rounded-lg p-2 w-full ${errors.assignedTo ? 'border-red-500' : 'border-gray-300'}`}
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

          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-semibold">Subtasks</h3>
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
                  className="border border-gray-300 rounded-lg p-2 flex-grow"
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
              className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
            >
              Add Todo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoModal;
