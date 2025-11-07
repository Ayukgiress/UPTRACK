import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';

const ProjectModal = ({ isOpen, onClose, onCreateProject }) => {
  const [project, setProject] = useState({
    name: '',
    description: '',
    status: 'active'
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!project.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setProject(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await onCreateProject({
          ...project,
          name: project.name.trim(),
          description: project.description.trim()
        });

        // Reset form
        setProject({
          name: '',
          description: '',
          status: 'active'
        });
        onClose();
      } catch (error) {
        // Error handling is done in parent component
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-md border border-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-card-foreground">Create New Project</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Project Name *
            </label>
            <input
              type="text"
              value={project.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`border rounded-lg p-3 w-full bg-background text-foreground ${errors.name ? 'border-red-500' : 'border-border'}`}
              placeholder="Enter project name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Description
            </label>
            <textarea
              value={project.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="border border-border rounded-lg p-3 w-full min-h-[100px] bg-background text-foreground"
              placeholder="Enter project description (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Status
            </label>
            <select
              value={project.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="border border-border rounded-lg p-3 w-full bg-background text-foreground"
            >
              <option value="active">Active</option>
              <option value="planning">Planning</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>

          <div className="flex justify-between gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-muted text-muted-foreground rounded-lg px-4 py-2 hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-primary-foreground rounded-lg px-4 py-2 hover:bg-primary/90 transition-colors"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
