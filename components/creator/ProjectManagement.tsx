'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  CalendarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  FolderOpenIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface Project {
  id: string;
  title: string;
  description: string;
  short_description: string;
  project_type: string;
  category: string;
  status: 'draft' | 'active' | 'completed' | 'archived' | 'cancelled';
  visibility: 'private' | 'team' | 'public' | 'unlisted';
  progress_percentage: number;
  base_price: number;
  revenue_generated: number;
  team_size: number;
  cover_image_url?: string;
  created_at: string;
  updated_at: string;
  deadline_at?: string;
  project_collaborations?: unknown[];
}

interface ProjectFilters {
  status?: string;
  category?: string;
  search?: string;
  sort: string;
  order: 'asc' | 'desc';
}

export default function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProjectFilters>({
    sort: 'updated_at',
    order: 'desc'
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`/api/creator/projects?${params}`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof ProjectFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCreateProject = async (projectData: any) => {
    try {
      const response = await fetch('/api/creator/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(prev => [data.project, ...prev]);
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'active':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 'cancelled':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <FolderOpenIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'archived':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={() => setSelectedProject(project)}
    >
      {/* Project Cover */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-xl relative overflow-hidden">
        {project.cover_image_url ? (
          <img 
            src={project.cover_image_url} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FolderOpenIcon className="h-12 w-12 text-white/70" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {getStatusIcon(project.status)}
            <span className="ml-1 capitalize">{project.status}</span>
          </span>
        </div>

        {/* Visibility Badge */}
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
            {project.visibility}
          </span>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {project.title}
          </h3>
          <button className="p-1 hover:bg-gray-100 rounded-md">
            <EllipsisVerticalIcon className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {project.short_description || project.description}
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-700">Progress</span>
            <span className="text-xs text-gray-500">{project.progress_percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${project.progress_percentage}%` }}
            />
          </div>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <CurrencyDollarIcon className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-xs font-medium text-gray-900">
              {formatCurrency(project.revenue_generated || 0)}
            </p>
            <p className="text-xs text-gray-500">Revenue</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <UserGroupIcon className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-xs font-medium text-gray-900">{project.team_size}</p>
            <p className="text-xs text-gray-500">Team</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <CalendarIcon className="h-4 w-4 text-orange-600" />
            </div>
            <p className="text-xs font-medium text-gray-900">
              {project.deadline_at ? 
                new Date(project.deadline_at).toLocaleDateString() : 
                'No deadline'
              }
            </p>
            <p className="text-xs text-gray-500">Deadline</p>
          </div>
        </div>

        {/* Project Type & Category */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
            {project.category}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(project.updated_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.div>
  );

  const ProjectListItem = ({ project }: { project: Project }) => (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
      onClick={() => setSelectedProject(project)}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {/* Project Icon/Image */}
            <div className="flex-shrink-0">
              {project.cover_image_url ? (
                <img 
                  src={project.cover_image_url} 
                  alt={project.title}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FolderOpenIcon className="h-6 w-6 text-white" />
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {project.title}
                </h3>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate">
                {project.short_description || project.description}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-xs text-gray-500">{project.category}</span>
                <span className="text-xs text-gray-500">
                  {project.team_size} {project.team_size === 1 ? 'member' : 'members'}
                </span>
                <span className="text-xs text-gray-500">
                  Updated {new Date(project.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Progress & Stats */}
          <div className="flex items-center space-x-8">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">
                {formatCurrency(project.revenue_generated || 0)}
              </p>
              <p className="text-xs text-gray-500">Revenue</p>
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">{project.progress_percentage}%</p>
              <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${project.progress_percentage}%` }}
                />
              </div>
            </div>

            <button className="p-2 hover:bg-gray-100 rounded-md">
              <EllipsisVerticalIcon className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
              <p className="text-sm text-gray-600">Manage your creative projects and collaborations</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New Project
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-8">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Category Filter */}
            <select
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="design">Design</option>
              <option value="development">Development</option>
              <option value="marketing">Marketing</option>
              <option value="content">Content</option>
              <option value="consulting">Consulting</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort */}
            <select
              value={`${filters.sort}-${filters.order}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split('-');
                setFilters(prev => ({ ...prev, sort, order: order as 'asc' | 'desc' }));
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="updated_at-desc">Recently Updated</option>
              <option value="created_at-desc">Recently Created</option>
              <option value="title-asc">Name A-Z</option>
              <option value="title-desc">Name Z-A</option>
              <option value="progress_percentage-desc">Progress High-Low</option>
              <option value="revenue_generated-desc">Revenue High-Low</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-l-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-r-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Projects Display */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first project</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Project
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {projects.map((project) => (
                  <ProjectListItem key={project.id} project={project} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Create Project Modal would go here */}
    </div>
  );
}