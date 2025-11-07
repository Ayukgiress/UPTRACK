import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Pages/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { FolderOpen, Plus, Users, CheckCircle, Clock, UserPlus, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ProjectModal from '../../Components/Modals/ProjectModal';
import InviteContributorModal from '../../Components/Modals/InviteContributorModal';
import { API_BASE_URL } from '../../lib/constants';

const Projects = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (currentUser) {
      fetchProjects();
    }
  }, [currentUser]);

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
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const response = await axios.post(
      `${API_BASE_URL}/projects/api/projects`,
        {
          ...projectData,
          createdBy: currentUser._id
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setProjects(prev => [response.data, ...prev]);
      toast.success('Project created successfully!');
      setIsProjectModalOpen(false);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    }
  };

  const handleInviteContributor = async (email, name, projectId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/accept-invitation/api/projects/${projectId}/invite`,
        { email, name },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Invitation sent successfully!');
      setIsInviteModalOpen(false);
      fetchProjects(); // Refresh to get updated contributor count
    } catch (error) {
      console.error('Error inviting contributor:', error);
      toast.error('Failed to send invitation');
    }
  };

  const openInviteModal = (project) => {
    setSelectedProject(project);
    setIsInviteModalOpen(true);
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('Projects')}</h1>
          <p className="text-muted-foreground">{t('Manage your projects and collaborate with team members')}</p>
        </div>
        <button
          onClick={() => setIsProjectModalOpen(true)}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Plus size={20} />
          {t('Create Project')}
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">{t('No Projects Yet')}</h3>
          <p className="text-muted-foreground mb-6">{t('Create your first project to start collaborating')}</p>
          <button
            onClick={() => setIsProjectModalOpen(true)}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
          >
            <Plus size={20} />
            {t('Create Your First Project')}
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project._id} className="bg-card rounded-xl shadow-lg border border-border p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-card-foreground mb-2 line-clamp-2">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
                      {project.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                  {project.status || 'Active'}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  {(project.contributors?.length || 0) + 1} contributors
                </span>
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openInviteModal(project)}
                  className="flex-1 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <UserPlus size={16} />
                  {t('Invite')}
                </button>
                <button
                  className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Eye size={16} />
                  {t('View')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onCreateProject={handleCreateProject}
      />

      <InviteContributorModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInviteContributor={handleInviteContributor}
        project={selectedProject}
      />
    </div>
  );
};

export default Projects;
