import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  User, 
  MessageSquare,
  RefreshCw,
  Check,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { blogService, BlogPost, BlogComment, BlogCategory } from '@/services/blogService';
import { supabase } from '@/integrations/supabase/client';

const BlogManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();

  // Separate forms to prevent cursor jumping
  const [createForm, setCreateForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    author: '',
    category: '',
    tags: '',
    is_published: false,
    is_featured: false
  });

  const [editForm, setEditForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    author: '',
    category: '',
    tags: '',
    is_published: false,
    is_featured: false
  });

  useEffect(() => {
    fetchBlogData();
  }, []);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      const [postsData, commentsData, categoriesData] = await Promise.all([
        blogService.getAllPosts(),
        blogService.getAllComments(),
        blogService.getCategories()
      ]);

      setPosts(postsData);
      setComments(commentsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching blog data:', error);
      toast({
        title: "Error",
        description: "Failed to load blog data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    // Add timestamp to make it unique
    const timestamp = Date.now();
    return `${baseSlug}-${timestamp}`;
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('🔍 Creating post with form data:', createForm);
      
      // Validate required fields
      if (!createForm.title || !createForm.content || !createForm.author) {
        toast({
          title: "Validation Error",
          description: "Please fill in Title, Content, and Author fields.",
          variant: "destructive",
        });
        return;
      }

      const newPost = {
        ...createForm,
        slug: createForm.slug || generateSlug(createForm.title),
        tags: createForm.tags ? createForm.tags.split(',').map(tag => tag.trim()) : [],
        published_at: createForm.is_published ? new Date().toISOString() : null
      };

      console.log('🔍 Sending post data to service:', newPost);
      
      const result = await blogService.createPost(newPost);
      console.log('✅ Post created successfully:', result);
      
      toast({
        title: "Success",
        description: "Blog post created successfully!",
      });

      setShowCreateDialog(false);
      setCreateForm({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featured_image: '',
        author: '',
        category: '',
        tags: '',
        is_published: false,
        is_featured: false
      });
      fetchBlogData();
    } catch (error) {
      console.error('❌ Error creating post:', error);
      
      // More detailed error message
      let errorMessage = "Failed to create blog post. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as any).message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPost) return;

    try {
      const updates = {
        ...editForm,
        tags: editForm.tags ? editForm.tags.split(',').map(tag => tag.trim()) : [],
        published_at: editForm.is_published ? (editingPost.published_at || new Date().toISOString()) : null
      };

      await blogService.updatePost(editingPost.id, updates);
      
      toast({
        title: "Success",
        description: "Blog post updated successfully!",
      });

      setShowEditDialog(false);
      setEditingPost(null);
      setEditForm({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featured_image: '',
        author: '',
        category: '',
        tags: '',
        is_published: false,
        is_featured: false
      });
      fetchBlogData();
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Error",
        description: "Failed to update blog post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      await blogService.deletePost(postId);
      toast({
        title: "Success",
        description: "Blog post deleted successfully!",
      });
      fetchBlogData();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete blog post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setEditForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      featured_image: post.featured_image || '',
      author: post.author,
      category: post.category || '',
      tags: post.tags ? post.tags.join(', ') : '',
      is_published: post.is_published,
      is_featured: post.is_featured
    });
    setShowEditDialog(true);
  };

  const handleModerateComment = async (commentId: number, isApproved: boolean) => {
    try {
      await blogService.moderateComment(commentId, isApproved);
      toast({
        title: "Success",
        description: `Comment ${isApproved ? 'approved' : 'rejected'} successfully!`,
      });
      fetchBlogData();
    } catch (error) {
      console.error('Error moderating comment:', error);
      toast({
        title: "Error",
        description: "Failed to moderate comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Comment deleted successfully!",
      });
      fetchBlogData();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-amber-600" />
        <span className="ml-2 text-slate-600">Loading blog data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Blog Management</h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => window.open('/blog', '_blank')} 
            variant="outline" 
            size="sm"
            className="bg-blue-50 text-blue-700 border-blue-300"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Blog
          </Button>
          <Button onClick={fetchBlogData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Blog Post</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Title *</Label>
                    <Input
                      value={createForm.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setCreateForm(prev => ({ 
                          ...prev, 
                          title: newTitle,
                          slug: !prev.slug ? generateSlug(newTitle) : prev.slug
                        }));
                      }}
                      required
                      placeholder="Enter blog post title"
                    />
                  </div>
                  <div>
                    <Label>Slug *</Label>
                    <Input
                      value={createForm.slug}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, slug: e.target.value }))}
                      required
                      placeholder="url-friendly-slug"
                    />
                  </div>
                </div>

                <div>
                  <Label>Excerpt</Label>
                  <Textarea
                    value={createForm.excerpt}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={2}
                    placeholder="Brief description..."
                  />
                </div>

                <div>
                  <Label>Content * (Markdown supported)</Label>
                  <Textarea
                    value={createForm.content}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, content: e.target.value }))}
                    rows={12}
                    required
                    placeholder="Write your blog content here..."
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Featured Image</Label>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label>Image URL</Label>
                        <Input
                          type="url"
                          value={createForm.featured_image}
                          onChange={(e) => setCreateForm(prev => ({ ...prev, featured_image: e.target.value }))}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div>
                        <Label>Upload Image</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                toast({
                                  title: "Uploading...",
                                  description: "Please wait while we upload your image.",
                                });

                                const fileExt = file.name.split('.').pop();
                                const fileName = `blog-${Date.now()}.${fileExt}`;
                                
                                // Upload to Supabase storage
                                const { data, error } = await supabase.storage
                                  .from('blog-images')
                                  .upload(fileName, file);

                                if (error) {
                                  console.error('Storage error:', error);
                                  // If storage fails, convert to base64 for permanent storage
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    const base64 = event.target?.result as string;
                                    setCreateForm(prev => ({ ...prev, featured_image: base64 }));
                                    toast({
                                      title: "Image Uploaded",
                                      description: "Image uploaded successfully as base64.",
                                    });
                                  };
                                  reader.readAsDataURL(file);
                                } else {
                                  // Get public URL
                                  const { data: { publicUrl } } = supabase.storage
                                    .from('blog-images')
                                    .getPublicUrl(fileName);
                                  
                                  setCreateForm(prev => ({ ...prev, featured_image: publicUrl }));
                                  toast({
                                    title: "Image Uploaded",
                                    description: "Image uploaded successfully to storage.",
                                  });
                                }
                              } catch (error) {
                                console.error('Error uploading image:', error);
                                toast({
                                  title: "Upload Failed",
                                  description: "Failed to upload image. Please try again.",
                                  variant: "destructive",
                                });
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Author *</Label>
                    <Input
                      value={createForm.author}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, author: e.target.value }))}
                      required
                      placeholder="Author name"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Category</Label>
                    <select
                      value={createForm.category}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Tags</Label>
                    <Input
                      value={createForm.tags}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="crafting, DIY, tutorial"
                    />
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={createForm.is_published}
                      onCheckedChange={(checked) => setCreateForm(prev => ({ ...prev, is_published: checked }))}
                    />
                    <Label>Published</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={createForm.is_featured}
                      onCheckedChange={(checked) => setCreateForm(prev => ({ ...prev, is_featured: checked }))}
                    />
                    <Label>Featured</Label>
                  </div>
                </div>

                {createForm.featured_image && (
                  <div>
                    <Label>Image Preview</Label>
                    <img 
                      src={createForm.featured_image} 
                      alt="Preview" 
                      className="w-full max-w-md h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                    Create Post
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdatePost} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Title *</Label>
                <Input
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label>Slug *</Label>
                <Input
                  value={editForm.slug}
                  onChange={(e) => setEditForm(prev => ({ ...prev, slug: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label>Excerpt</Label>
              <Textarea
                value={editForm.excerpt}
                onChange={(e) => setEditForm(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={2}
              />
            </div>

            <div>
              <Label>Content *</Label>
              <Textarea
                value={editForm.content}
                onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                rows={12}
                required
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-4">
              <div>
                <Label>Featured Image</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Image URL</Label>
                    <Input
                      type="url"
                      value={editForm.featured_image}
                      onChange={(e) => setEditForm(prev => ({ ...prev, featured_image: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <Label>Upload Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            toast({
                              title: "Uploading...",
                              description: "Please wait while we upload your image.",
                            });

                            const fileExt = file.name.split('.').pop();
                            const fileName = `blog-${Date.now()}.${fileExt}`;
                            
                            // Upload to Supabase storage
                            const { data, error } = await supabase.storage
                              .from('blog-images')
                              .upload(fileName, file);

                            if (error) {
                              console.error('Storage error:', error);
                              // If storage fails, convert to base64 for permanent storage
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const base64 = event.target?.result as string;
                                setEditForm(prev => ({ ...prev, featured_image: base64 }));
                                toast({
                                  title: "Image Uploaded",
                                  description: "Image uploaded successfully as base64.",
                                });
                              };
                              reader.readAsDataURL(file);
                            } else {
                              // Get public URL
                              const { data: { publicUrl } } = supabase.storage
                                .from('blog-images')
                                .getPublicUrl(fileName);
                              
                              setEditForm(prev => ({ ...prev, featured_image: publicUrl }));
                              toast({
                                title: "Image Uploaded",
                                description: "Image uploaded successfully to storage.",
                              });
                            }
                          } catch (error) {
                            console.error('Error uploading image:', error);
                            toast({
                              title: "Upload Failed",
                              description: "Failed to upload image. Please try again.",
                              variant: "destructive",
                            });
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Author *</Label>
                <Input
                  value={editForm.author}
                  onChange={(e) => setEditForm(prev => ({ ...prev, author: e.target.value }))}
                  required
                  placeholder="Author name"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Category</Label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Tags</Label>
                <Input
                  value={editForm.tags}
                  onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editForm.is_published}
                  onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, is_published: checked }))}
                />
                <Label>Published</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editForm.is_featured}
                  onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, is_featured: checked }))}
                />
                <Label>Featured</Label>
              </div>
            </div>

            {editForm.featured_image && (
              <div>
                <Label>Image Preview</Label>
                <img 
                  src={editForm.featured_image} 
                  alt="Preview" 
                  className="w-full max-w-md h-48 object-cover rounded-lg border"
                />
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                Update Post
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowEditDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Posts ({posts.length})
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Comments ({comments.filter(c => !c.is_approved).length} pending)
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            Categories ({categories.length})
          </TabsTrigger>
        </TabsList>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-4">
          {posts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No Blog Posts</h3>
                <p className="text-slate-500 mb-4">Create your first blog post to get started.</p>
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Post
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-slate-800">
                            <button
                              onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                              className="hover:text-amber-600 transition-colors text-left"
                              title="Preview blog post"
                            >
                              {post.title}
                            </button>
                          </h3>
                          <div className="flex gap-1">
                            {post.is_published ? (
                              <Badge className="bg-green-100 text-green-800">Published</Badge>
                            ) : (
                              <Badge variant="outline">Draft</Badge>
                            )}
                            {post.is_featured && (
                              <Badge className="bg-amber-100 text-amber-800">Featured</Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm mb-2 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {post.published_at ? formatDate(post.published_at) : 'Not published'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.view_count} views
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditPost(post)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Comments Tab */}
        <TabsContent value="comments" className="space-y-4">
          {comments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No Comments</h3>
                <p className="text-slate-500">Comments will appear here when users interact with your blog posts.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {comments.map((comment) => (
                <Card key={comment.id} className={!comment.is_approved ? 'border-amber-200 bg-amber-50' : ''}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-slate-800">{comment.user_name}</span>
                          <span className="text-sm text-slate-500">({comment.user_email})</span>
                          {comment.is_approved ? (
                            <Badge className="bg-green-100 text-green-800">Approved</Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
                          )}
                        </div>
                        <p className="text-slate-700 mb-2">{comment.content}</p>
                        <div className="text-xs text-slate-500">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {formatDate(comment.created_at)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!comment.is_approved ? (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleModerateComment(comment.id, true)}
                              className="text-green-600 hover:text-green-700"
                              title="Approve Comment"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleModerateComment(comment.id, false)}
                              className="text-red-600 hover:text-red-700"
                              title="Reject Comment"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleModerateComment(comment.id, false)}
                            className="text-orange-600 hover:text-orange-700"
                            title="Unapprove Comment"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete Comment"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-slate-800 mb-2">{category.name}</h3>
                  <p className="text-sm text-slate-600 mb-2">{category.description}</p>
                  <div className="text-xs text-slate-500">
                    Slug: {category.slug}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlogManagement;