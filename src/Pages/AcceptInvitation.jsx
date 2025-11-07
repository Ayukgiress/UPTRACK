import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Loader2, Users, Mail, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../lib/constants';

const AcceptInvitation = () => {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [invitationStatus, setInvitationStatus] = useState(null); // 'accepted', 'declined', 'error'

  const email = searchParams.get('email');

  useEffect(() => {
    if (projectId && email) {
      fetchProjectDetails();
    }
  }, [projectId, email]);

  const fetchProjectDetails = async () => {
    try {
      console.log('Fetching project details for:', { projectId, email });
      
      // Try without auth for public access
      const response = await axios.get(
        `${API_BASE_URL}/accept-invitation/api/projects/${projectId}`,
        {
          params: { email },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Response:', response.data);
      const projectData = response.data.project || response.data;
      setProject(projectData);
    } catch (error) {
      console.error('Error fetching project:', error.response?.data || error);
      
      // If that fails, try with auth token
      try {
        const token = localStorage.getItem('token');
        if (token) {
          console.log('Retrying with auth token');
          const response = await axios.get(
            `${API_BASE_URL}/accept-invitation/api/projects/${projectId}`,
            {
              params: { email },
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          const projectData = response.data.project || response.data;
          setProject(projectData);
        } else {
          throw error; // Re-throw original error if no token
        }
      } catch (authError) {
        console.error('Error fetching project with auth:', authError.response?.data || authError);
        toast.error(authError.response?.data?.error || 'Failed to load project details');
        setInvitationStatus('error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      await axios.post(
        `${API_BASE_URL}/accept-invitation/api/projects/${projectId}/accept-invitation`,
        { email },
        { headers }
      );

      setInvitationStatus('accepted');
      toast.success('Invitation accepted successfully!');
    } catch (error) {
      console.error('Error accepting invitation:', error.response?.data || error);
      toast.error(error.response?.data?.error || 'Failed to accept invitation');
      setInvitationStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeclineInvitation = async () => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      await axios.post(
        `${API_BASE_URL}/accept-invitation/api/projects/${projectId}/decline-invitation`,
        { email },
        { headers }
      );

      setInvitationStatus('declined');
      toast.success('Invitation declined');
    } catch (error) {
      console.error('Error declining invitation:', error.response?.data || error);
      toast.error(error.response?.data?.error || 'Failed to decline invitation');
      setInvitationStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard/projects');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading invitation details...</p>
        </div>
      </div>
    );
  }

  if (invitationStatus === 'accepted') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full bg-card rounded-lg shadow-lg border border-border p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-card-foreground mb-2">Invitation Accepted!</h1>
          <p className="text-muted-foreground mb-6">
            You have successfully joined the project "{project?.name}".
          </p>
          <button
            onClick={handleGoToDashboard}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go to Projects
          </button>
        </div>
      </div>
    );
  }

  if (invitationStatus === 'declined') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full bg-card rounded-lg shadow-lg border border-border p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-card-foreground mb-2">Invitation Declined</h1>
          <p className="text-muted-foreground mb-6">
            You have declined the invitation to join "{project?.name}".
          </p>
          <button
            onClick={handleGoToDashboard}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go to Projects
          </button>
        </div>
      </div>
    );
  }

  if (invitationStatus === 'error' || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full bg-card rounded-lg shadow-lg border border-border p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-card-foreground mb-2">Invalid Invitation</h1>
          <p className="text-muted-foreground mb-6">
            This invitation link is invalid or has expired.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Sign In
            </button>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-primary hover:underline"
              >
                Create one here
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card rounded-lg shadow-lg border border-border p-8">
        <div className="text-center mb-6">
          <Users className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-card-foreground mb-2">Project Invitation</h1>
          <p className="text-muted-foreground">
            You've been invited to join a project
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-card-foreground mb-2">{project.name}</h3>
          {project.description && (
            <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>Invited to: {email}</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleAcceptInvitation}
            disabled={isProcessing}
            className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            Accept Invitation
          </button>

          <button
            onClick={handleDeclineInvitation}
            disabled={isProcessing}
            className="w-full bg-muted text-muted-foreground px-6 py-3 rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            Decline Invitation
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitation;