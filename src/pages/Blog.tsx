import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, User, Eye, Search, BookOpen, Tag } from 'lucide-react';
import { blogService, BlogPost, BlogCategory } from '@/services/blogService';
import { useToast } from '@/hooks/use-toast';

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchBlogData();
  }, []);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Blog: Fetching blog data...');

      const [postsData, featuredData, categoriesData] = await Promise.all([
        blogService.getPublishedPosts(),
        blogService.getFeaturedPosts(3),
        blogService.getCategories()
      ]);

      setPosts(postsData);
      setFeaturedPosts(featuredData);
      setCategories(categoriesData);

      console.log('✅ Blog: Data loaded successfully');
    } catch (error) {
      console.error('❌ Blog: Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load blog posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchBlogData();
      return;
    }

    try {
      setLoading(true);
      const searchResults = await blogService.searchPosts(searchTerm);
      setPosts(searchResults);
    } catch (error) {
      console.error('❌ Blog: Error searching posts:', error);
      toast({
        title: "Error",
        description: "Failed to search blog posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = async (categorySlug: string) => {
    try {
      setLoading(true);
      setSelectedCategory(categorySlug);
      
      if (categorySlug === '') {
        const allPosts = await blogService.getPublishedPosts();
        setPosts(allPosts);
      } else {
        const categoryPosts = await blogService.getPostsByCategory(categorySlug);
        setPosts(categoryPosts);
      }
    } catch (error) {
      console.error('❌ Blog: Error filtering by category:', error);
      toast({
        title: "Error",
        description: "Failed to filter posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const BlogPostCard = ({ post, featured = false }: { post: BlogPost; featured?: boolean }) => (
    <Card className={`hover:shadow-lg transition-shadow ${featured ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50' : ''}`}>
      {post.featured_image && (
        <div className="relative overflow-hidden">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          />
          {featured && (
            <Badge className="absolute top-3 left-3 bg-amber-500 text-white">
              Featured
            </Badge>
          )}
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(post.published_at)}</span>
          <span>•</span>
          <User className="h-4 w-4" />
          <span>{post.author}</span>
          {post.view_count > 0 && (
            <>
              <span>•</span>
              <Eye className="h-4 w-4" />
              <span>{post.view_count} views</span>
            </>
          )}
        </div>
        
        <h3 className={`font-bold text-slate-800 hover:text-amber-600 transition-colors ${featured ? 'text-xl' : 'text-lg'}`}>
          <Link to={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-slate-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {post.category && (
              <Badge variant="outline" className="text-xs">
                {post.category}
              </Badge>
            )}
            {post.tags && post.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
          
          <Link to={`/blog/${post.slug}`}>
            <Button variant="outline" size="sm">
              Read More
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <BookOpen className="h-8 w-8 animate-pulse text-amber-600 mr-3" />
            <span className="text-lg text-slate-600">Loading blog posts...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Charmntreats Blog
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-6">
            Discover the art of handcrafted treasures, DIY tutorials, and creative inspiration
          </p>
          <a 
            href="https://www.charmntreats.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2">
              Visit Our Main Website →
            </Button>
          </a>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} className="bg-amber-600 hover:bg-amber-700">
              Search
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryFilter('')}
              className={selectedCategory === '' ? 'bg-amber-600 hover:bg-amber-700' : ''}
            >
              All Posts
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.slug ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryFilter(category.slug)}
                className={selectedCategory === category.slug ? 'bg-amber-600 hover:bg-amber-700' : ''}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && selectedCategory === '' && !searchTerm && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
              Featured Posts
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} featured={true} />
              ))}
            </div>
          </div>
        )}

        {/* All Posts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            {searchTerm ? `Search Results for "${searchTerm}"` : 
             selectedCategory ? `Posts in ${categories.find(c => c.slug === selectedCategory)?.name}` : 
             'Latest Posts'}
          </h2>

          {posts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">
                  {searchTerm ? 'No posts found' : 'No blog posts yet'}
                </h3>
                <p className="text-slate-500">
                  {searchTerm 
                    ? 'Try adjusting your search terms or browse all posts.' 
                    : 'Check back soon for new content!'}
                </p>
                {searchTerm && (
                  <Button 
                    onClick={() => {
                      setSearchTerm('');
                      fetchBlogData();
                    }}
                    className="mt-4 bg-amber-600 hover:bg-amber-700"
                  >
                    View All Posts
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Categories Overview */}
        {categories.length > 0 && selectedCategory === '' && !searchTerm && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
              Explore Categories
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleCategoryFilter(category.slug)}>
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-slate-800 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;