import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Pages/AuthContext';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project._id} className="bg-card rounded-2xl shadow-xl border border-border p-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
              <div className="flex flex-col h-full">
                <div className="flex-1 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-card-foreground line-clamp-2 leading-tight">
                      {project.name}
                    </h3>
                  </div>

                  {project.description && (
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                      {project.status || 'Active'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Users size={16} />
                      {(project.contributors?.length || 0) + 1} contributors
                    </span>
                    <span className="text-xs">{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={() => openInviteModal(project)}
                    className="flex-1 bg-secondary text-secondary-foreground px-4 py-3 rounded-xl hover:bg-secondary/80 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium shadow-md hover:shadow-lg"
                  >
                    <UserPlus size={16} />
                    {t('Invite')}
                  </button>
                  <button
                    onClick={() => navigate(`/dashboard/projects/${project._id}`)}
                    className="flex-1 bg-primary text-primary-foreground px-4 py-3 rounded-xl hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium shadow-md hover:shadow-lg"
                  >
                    <Eye size={16} />
                    {t('View')}
                  </button>
                </div>
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
