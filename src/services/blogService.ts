import { supabase } from '@/integrations/supabase/client';

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author: string;
  category: string;
  tags: string[];
  is_published: boolean;
  is_featured: boolean;
  view_count: number;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  created_at: string;
}

export interface BlogComment {
  id: number;
  post_id: number;
  user_name: string;
  user_email: string;
  content: string;
  is_approved: boolean;
  created_at: string;
}

class BlogService {
  // Get all published blog posts
  async getPublishedPosts(limit?: number): Promise<BlogPost[]> {
    try {
      console.log('🔍 BlogService: Fetching published blog posts...');
      
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ BlogService: Error fetching published posts:', error);
        throw error;
      }

      console.log('✅ BlogService: Published posts fetched:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ BlogService: Error in getPublishedPosts:', error);
      throw error;
    }
  }

  // Get featured blog posts
  async getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
    try {
      console.log('🔍 BlogService: Fetching featured blog posts...');
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .eq('is_featured', true)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ BlogService: Error fetching featured posts:', error);
        throw error;
      }

      console.log('✅ BlogService: Featured posts fetched:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ BlogService: Error in getFeaturedPosts:', error);
      throw error;
    }
  }

  // Get single blog post by slug
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      console.log('🔍 BlogService: Fetching blog post by slug:', slug);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('ℹ️ BlogService: Post not found:', slug);
          return null;
        }
        console.error('❌ BlogService: Error fetching post by slug:', error);
        throw error;
      }

      console.log('✅ BlogService: Post fetched:', data?.title);
      return data;
    } catch (error) {
      console.error('❌ BlogService: Error in getPostBySlug:', error);
      throw error;
    }
  }

  // Get posts by category
  async getPostsByCategory(categorySlug: string, limit?: number): Promise<BlogPost[]> {
    try {
      console.log('🔍 BlogService: Fetching posts by category:', categorySlug);
      
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .eq('category', categorySlug)
        .order('published_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ BlogService: Error fetching posts by category:', error);
        throw error;
      }

      console.log('✅ BlogService: Posts by category fetched:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ BlogService: Error in getPostsByCategory:', error);
      throw error;
    }
  }

  // Get all blog categories
  async getCategories(): Promise<BlogCategory[]> {
    try {
      console.log('🔍 BlogService: Fetching blog categories...');
      
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('❌ BlogService: Error fetching categories:', error);
        throw error;
      }

      console.log('✅ BlogService: Categories fetched:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ BlogService: Error in getCategories:', error);
      throw error;
    }
  }

  // Get comments for a blog post
  async getPostComments(postId: number): Promise<BlogComment[]> {
    try {
      console.log('🔍 BlogService: Fetching comments for post:', postId);
      
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('post_id', postId)
        .eq('is_approved', true)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ BlogService: Error fetching comments:', error);
        throw error;
      }

      console.log('✅ BlogService: Comments fetched:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ BlogService: Error in getPostComments:', error);
      throw error;
    }
  }

  // Submit a new comment
  async submitComment(postId: number, userName: string, userEmail: string, content: string): Promise<void> {
    try {
      console.log('🔍 BlogService: Submitting comment for post:', postId);
      
      const { error } = await supabase
        .from('blog_comments')
        .insert({
          post_id: postId,
          user_name: userName,
          user_email: userEmail,
          content: content,
          is_approved: false // Comments need approval
        });

      if (error) {
        console.error('❌ BlogService: Error submitting comment:', error);
        throw error;
      }

      console.log('✅ BlogService: Comment submitted successfully');
    } catch (error) {
      console.error('❌ BlogService: Error in submitComment:', error);
      throw error;
    }
  }

  // Increment view count for a blog post
  async incrementViewCount(postId: number): Promise<void> {
    try {
      console.log('🔍 BlogService: Incrementing view count for post:', postId);
      
      const { error } = await supabase.rpc('increment_view_count', {
        post_id: postId
      });

      if (error) {
        console.error('❌ BlogService: Error incrementing view count:', error);
        // Don't throw error for view count - it's not critical
      } else {
        console.log('✅ BlogService: View count incremented');
      }
    } catch (error) {
      console.error('❌ BlogService: Error in incrementViewCount:', error);
      // Don't throw error for view count - it's not critical
    }
  }

  // Search blog posts
  async searchPosts(searchTerm: string): Promise<BlogPost[]> {
    try {
      console.log('🔍 BlogService: Searching posts for:', searchTerm);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`)
        .order('published_at', { ascending: false });

      if (error) {
        console.error('❌ BlogService: Error searching posts:', error);
        throw error;
      }

      console.log('✅ BlogService: Search results:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ BlogService: Error in searchPosts:', error);
      throw error;
    }
  }

  // Admin functions
  async getAllPosts(): Promise<BlogPost[]> {
    try {
      console.log('🔍 BlogService: Fetching all blog posts (admin)...');
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ BlogService: Error fetching all posts:', error);
        throw error;
      }

      console.log('✅ BlogService: All posts fetched:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ BlogService: Error in getAllPosts:', error);
      throw error;
    }
  }

  async createPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'view_count'>): Promise<BlogPost> {
    try {
      console.log('🔍 BlogService: Creating new blog post:', post.title);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(post)
        .select()
        .single();

      if (error) {
        console.error('❌ BlogService: Error creating post:', error);
        throw error;
      }

      console.log('✅ BlogService: Post created successfully:', data.title);
      return data;
    } catch (error) {
      console.error('❌ BlogService: Error in createPost:', error);
      throw error;
    }
  }

  async updatePost(id: number, updates: Partial<BlogPost>): Promise<BlogPost> {
    try {
      console.log('🔍 BlogService: Updating blog post:', id);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ BlogService: Error updating post:', error);
        throw error;
      }

      console.log('✅ BlogService: Post updated successfully:', data.title);
      return data;
    } catch (error) {
      console.error('❌ BlogService: Error in updatePost:', error);
      throw error;
    }
  }

  async deletePost(id: number): Promise<void> {
    try {
      console.log('🔍 BlogService: Deleting blog post:', id);
      
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ BlogService: Error deleting post:', error);
        throw error;
      }

      console.log('✅ BlogService: Post deleted successfully');
    } catch (error) {
      console.error('❌ BlogService: Error in deletePost:', error);
      throw error;
    }
  }

  // Get all comments (admin)
  async getAllComments(): Promise<BlogComment[]> {
    try {
      console.log('🔍 BlogService: Fetching all comments (admin)...');
      
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ BlogService: Error fetching all comments:', error);
        throw error;
      }

      console.log('✅ BlogService: All comments fetched:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ BlogService: Error in getAllComments:', error);
      throw error;
    }
  }

  // Approve/reject comment
  async moderateComment(commentId: number, isApproved: boolean): Promise<void> {
    try {
      console.log('🔍 BlogService: Moderating comment:', commentId, 'approved:', isApproved);
      
      const { error } = await supabase
        .from('blog_comments')
        .update({ is_approved: isApproved })
        .eq('id', commentId);

      if (error) {
        console.error('❌ BlogService: Error moderating comment:', error);
        throw error;
      }

      console.log('✅ BlogService: Comment moderated successfully');
    } catch (error) {
      console.error('❌ BlogService: Error in moderateComment:', error);
      throw error;
    }
  }
}

export const blogService = new BlogService();