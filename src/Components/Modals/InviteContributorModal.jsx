import React, { useState } from 'react';
import { X, Mail } from 'lucide-react';
import { toast } from 'sonner';

const InviteContributorModal = ({ isOpen, onClose, onInviteContributor, project }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm() && project) {
      try {
        await onInviteContributor(email.trim(), name.trim(), project._id);
        setEmail('');
        setName('');
        onClose();
      } catch (error) {
        // Error handling is done in parent component
      }
    }
  };

  const handleInputChange = (value) => {
    setEmail(value);
    if (errors.email) {
      setErrors({});
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-md border border-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-card-foreground">Invite Contributor</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-card-foreground mb-1">{project.name}</h3>
          <p className="text-sm text-muted-foreground">Invite a team member to collaborate on this project</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => handleInputChange(e.target.value)}
                className={`border rounded-lg p-3 pl-10 w-full bg-background text-foreground ${errors.email ? 'border-red-500' : 'border-border'}`}
                placeholder="Enter email address"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-lg p-3 w-full bg-background text-foreground border-border"
              placeholder="Enter contributor name"
            />
          </div>

          <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
            <p>An invitation will be sent to this email address. They will be able to view and contribute to project tasks.</p>
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
              className="bg-primary text-primary-foreground rounded-lg px-4 py-2 hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Mail size={16} />
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteContributorModal;
