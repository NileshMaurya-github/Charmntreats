import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, Eye, ArrowLeft, Tag, MessageCircle, Send } from 'lucide-react';
import { blogService, BlogPost, BlogComment } from '@/services/blogService';
import { useToast } from '@/hooks/use-toast';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentForm, setCommentForm] = useState({
    name: '',
    email: '',
    content: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      console.log('🔍 BlogPost: Fetching blog post:', slug);

      const postData = await blogService.getPostBySlug(slug!);
      
      if (!postData) {
        console.log('❌ BlogPost: Post not found');
        navigate('/blog');
        return;
      }

      setPost(postData);

      // Increment view count
      await blogService.incrementViewCount(postData.id);

      // Fetch comments and related posts
      const [commentsData, relatedData] = await Promise.all([
        blogService.getPostComments(postData.id),
        blogService.getPostsByCategory(postData.category, 3)
      ]);

      setComments(commentsData);
      // Filter out current post from related posts
      setRelatedPosts(relatedData.filter(p => p.id !== postData.id));

      console.log('✅ BlogPost: Data loaded successfully');
    } catch (error) {
      console.error('❌ BlogPost: Error fetching post:', error);
      toast({
        title: "Error",
        description: "Failed to load blog post. Please try again.",
        variant: "destructive",
      });
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!post || !commentForm.name.trim() || !commentForm.email.trim() || !commentForm.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setCommentLoading(true);
      console.log('🔍 BlogPost: Submitting comment...');

      await blogService.submitComment(
        post.id,
        commentForm.name.trim(),
        commentForm.email.trim(),
        commentForm.content.trim()
      );

      toast({
        title: "Comment Submitted",
        description: "Your comment has been submitted and is awaiting approval.",
      });

      // Reset form
      setCommentForm({ name: '', email: '', content: '' });

      console.log('✅ BlogPost: Comment submitted successfully');
    } catch (error) {
      console.error('❌ BlogPost: Error submitting comment:', error);
      toast({
        title: "Error",
        description: "Failed to submit comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCommentLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-slate-800 mb-4 mt-8">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-slate-800 mb-3 mt-6">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-slate-800 mb-2 mt-4">$1</h3>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/\n\n/g, '</p><p class="text-slate-700 leading-relaxed mb-4">')
      .replace(/\n/g, '<br />');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-lg text-slate-600">Loading blog post...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Post Not Found</h1>
            <Link to="/blog">
              <Button className="btn-dark-pink">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/blog">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              {/* Featured Image */}
              {post.featured_image && (
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-64 md:h-80 object-cover"
                  />
                  {post.is_featured && (
                    <Badge className="absolute top-4 left-4 bg-gray-500 text-white">
                      Featured
                    </Badge>
                  )}
                </div>
              )}

              <CardHeader className="pb-4">
                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.published_at)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  {post.view_count > 0 && (
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.view_count} views</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                  {post.title}
                </h1>

                {/* Tags and Category */}
                <div className="flex flex-wrap gap-2">
                  {post.category && (
                    <Badge variant="outline" className="text-sm">
                      {post.category}
                    </Badge>
                  )}
                  {post.tags && post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>

              <CardContent>
                {/* Excerpt */}
                {post.excerpt && (
                  <div className="text-lg text-slate-600 italic mb-6 p-4 bg-slate-50 rounded-lg border-l-4 border-amber-500">
                    {post.excerpt}
                  </div>
                )}

                {/* Content */}
                <div 
                  className="prose prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: `<p class="text-slate-700 leading-relaxed mb-4">${formatContent(post.content)}</p>` 
                  }}
                />
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Comments ({comments.length})
                </h3>
              </CardHeader>
              <CardContent>
                {/* Comment Form */}
                <form onSubmit={handleCommentSubmit} className="mb-8 space-y-4">
                  <h4 className="font-semibold text-slate-800">Leave a Comment</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      placeholder="Your Name"
                      value={commentForm.name}
                      onChange={(e) => setCommentForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={commentForm.email}
                      onChange={(e) => setCommentForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <Textarea
                    placeholder="Your Comment"
                    value={commentForm.content}
                    onChange={(e) => setCommentForm(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    required
                  />
                  <Button 
                    type="submit" 
                    disabled={commentLoading}
                    className="btn-dark-pink"
                  >
                    {commentLoading ? (
                      'Submitting...'
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Comment
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-slate-500">
                    Your comment will be reviewed before being published.
                  </p>
                </form>

                <Separator className="my-6" />

                {/* Comments List */}
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <MessageCircle className="h-12 w-12 mx-auto mb-3 text-slate-400" />
                    <p>No comments yet. Be the first to comment!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <div key={comment.id} className="border-l-2 border-amber-200 pl-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-slate-800">{comment.user_name}</span>
                          <span className="text-sm text-slate-500">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-slate-700">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-bold text-slate-800">Related Posts</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <div key={relatedPost.id} className="border-b border-slate-200 last:border-b-0 pb-4 last:pb-0">
                      <Link 
                        to={`/blog/${relatedPost.slug}`}
                        className="block hover:text-black transition-colors"
                      >
                        <h4 className="font-semibold text-slate-800 mb-1 line-clamp-2">
                          {relatedPost.title}
                        </h4>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(relatedPost.published_at)}</span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Back to Blog */}
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-slate-800 mb-3">Explore More</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Discover more handcrafted inspiration and DIY tutorials
                </p>
                <Link to="/blog">
                  <Button className="w-full btn-dark-pink">
                    View All Posts
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;