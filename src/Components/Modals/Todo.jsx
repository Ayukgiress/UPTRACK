import React, { useState } from 'react';
import axios from 'axios';
import { X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const TodoModal = ({ isOpen, onClose, onAddTodos }) => {
  const [todo, setTodo] = useState(getInitialTodoState());
  const [errors, setErrors] = useState({});
  const [assignedTo, setAssignedTo] = useState(''); // New state for assignedTo

  function getInitialTodoState() {
    return {
      title: '',
      description: '',
      subtodos: [],
      priority: 'medium',
      dueDate: '',
    };
  }

  const validateForm = () => {
    const newErrors = {};
    
    if (!todo.title.trim()) {
      newErrors.title = 'Title is required';
    }

    // Optional: Add more validation rules
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
    
    // Clear specific field errors when user starts typing
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
          assignedTo: assignedTo.trim() // Include assignedTo in the cleanedTodo
        };

        await onAddTodos(cleanedTodo);
        
        // Use toast for success notification
        toast.success('Todo added successfully!');
        
        setTodo(getInitialTodoState());
        setAssignedTo(''); // Reset assignedTo
        onClose();
      } catch (error) {
        // Use toast for error notification
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

          <input
        type="email"
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
        className="border rounded-lg p-2 w-full"
        placeholder="Enter email to assign reviewer"
      />

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

          <div className="flex justify-end gap-2 pt-4">
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
