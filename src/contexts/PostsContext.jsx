/**
 * Posts Context
 * Manages bulletin posts state and operations
 */

import { createContext, useState, useCallback, useEffect } from 'react';
import * as postService from '../services/postService';
import { notifyAdminOfNewPost } from '../services/notificationService';
import { logDataOperation, logError } from '../utils/logger';
import { filterBySearch, sortBy } from '../utils/helpers';

export const PostsContext = createContext(null);

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    architect: '',
    search: '',
    dateRange: null,
  });

  /**
   * Fetch all posts
   */
  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const allPosts = await postService.getAllPosts();
      setPosts(allPosts);
      setFilteredPosts(allPosts);
      logDataOperation('read', 'posts', { count: allPosts.length });
    } catch (error) {
      logError('Failed to fetch posts', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch single post
   */
  const fetchPost = useCallback(async (postId) => {
    try {
      setIsLoading(true);
      const post = await postService.getPost(postId);
      setSelectedPost(post);
      return post;
    } catch (error) {
      logError(`Failed to fetch post: ${postId}`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create new post
   */
  const createPost = useCallback(async (postData, attachments, createdBy, isArchitect = false) => {
    try {
      setIsLoading(true);
      const newPost = await postService.createPost(postData, attachments, createdBy);
      setPosts(prev => [newPost, ...prev]);

      // Notify admin if created by architect
      if (isArchitect) {
        await notifyAdminOfNewPost(newPost, createdBy);
      }

      return newPost;
    } catch (error) {
      logError('Failed to create post', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update post
   */
  const updatePost = useCallback(async (postId, updates, updatedBy) => {
    try {
      setIsLoading(true);
      const updatedPost = await postService.updatePost(postId, updates, updatedBy);
      setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(updatedPost);
      }
      return updatedPost;
    } catch (error) {
      logError(`Failed to update post: ${postId}`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [selectedPost]);

  /**
   * Delete post
   */
  const deletePost = useCallback(async (postId, deletedBy) => {
    try {
      setIsLoading(true);
      await postService.deletePost(postId, deletedBy);
      setPosts(prev => prev.filter(p => p.id !== postId));
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(null);
      }
    } catch (error) {
      logError(`Failed to delete post: ${postId}`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [selectedPost]);

  /**
   * Assign architect to post
   */
  const assignArchitect = useCallback(async (postId, architectUsername, updatedBy, adminAssigned) => {
    try {
      const updatedPost = await postService.assignArchitect(postId, architectUsername, updatedBy, adminAssigned);
      setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
      return updatedPost;
    } catch (error) {
      logError('Failed to assign architect', error);
      throw error;
    }
  }, []);

  /**
   * Update post status
   */
  const updateStatus = useCallback(async (postId, newStatus, updatedBy) => {
    try {
      const updatedPost = await postService.updateStatus(postId, newStatus, updatedBy);
      setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
      return updatedPost;
    } catch (error) {
      logError('Failed to update status', error);
      throw error;
    }
  }, []);

  /**
   * Archive post
   */
  const archivePost = useCallback(async (postId, archivedBy) => {
    try {
      const updatedPost = await postService.archivePost(postId, archivedBy);
      setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
      return updatedPost;
    } catch (error) {
      logError('Failed to archive post', error);
      throw error;
    }
  }, []);

  /**
   * Unarchive post
   */
  const unarchivePost = useCallback(async (postId, unarchivedBy) => {
    try {
      const updatedPost = await postService.unarchivePost(postId, unarchivedBy);
      setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
      return updatedPost;
    } catch (error) {
      logError('Failed to unarchive post', error);
      throw error;
    }
  }, []);

  /**
   * Apply filters to posts
   */
  useEffect(() => {
    let result = [...posts];

    // Filter by status
    if (filters.status) {
      result = result.filter(p => p.status === filters.status);
    }

    // Filter by architect
    if (filters.architect) {
      result = result.filter(p => p.assignedArchitects.includes(filters.architect));
    }

    // Filter by search query
    if (filters.search) {
      result = filterBySearch(result, filters.search, ['title', 'description', 'concernedParties']);
    }

    // Filter by date range
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      result = result.filter(p => {
        const postDate = new Date(p.createdAt);
        return postDate >= start && postDate <= end;
      });
    }

    setFilteredPosts(result);
  }, [posts, filters]);

  const value = {
    posts,
    filteredPosts,
    selectedPost,
    isLoading,
    filters,
    setFilters,
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    assignArchitect,
    updateStatus,
    archivePost,
    unarchivePost,
  };

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
};

export default PostsContext;
