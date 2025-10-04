import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, User, Eye, Search, BookOpen, Tag, TrendingUp, Clock, Heart, Share2 } from 'lucide-react';
import { blogService, BlogPost, BlogCategory } from '@/services/blogService';
import { useToast } from '@/hooks/use-toast';
import LazyImage from '@/components/ui/lazy-image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [scrollY, setScrollY] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      
      setScrollY(scrollTop);
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const BlogPostCard = ({ post, featured = false, index = 0 }: { post: BlogPost; featured?: boolean; index?: number }) => (
    <Card 
      className={`group relative overflow-hidden hover:shadow-[0_0_50px_rgba(236,72,153,0.5)] transition-all duration-500 hover:scale-105 animate-fade-in animate-delay-${(index % 6) * 100 + 200} ${
        featured 
          ? 'border-2 border-pink-400/50 bg-white/10 backdrop-blur-xl shadow-2xl' 
          : 'border-2 border-white/20 hover:border-pink-400/50 bg-white/5 backdrop-blur-xl shadow-xl'
      }`}
      onMouseEnter={() => setHoveredCard(post.id)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      {/* GOD-LEVEL Animated Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Floating Sparkles */}
      {hoveredCard === post.id && (
        <>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-pink-400 rounded-full animate-twinkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1}s`
              }}
            ></div>
          ))}
        </>
      )}
      
      {post.featured_image && (
        <div className="relative overflow-hidden">
          <LazyImage
            src={post.featured_image}
            alt={post.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700 border-b-2 border-white/10"
          />
          
          {/* Premium Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Premium Floating Action Buttons */}
          <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="p-2 bg-white/90 backdrop-blur-xl rounded-full hover:bg-white transition-colors duration-300 cursor-pointer hover:scale-110 shadow-xl border border-white/50">
              <Heart className="h-4 w-4 text-pink-600 drop-shadow-[0_0_5px_rgba(236,72,153,0.8)]" />
            </div>
            <div className="p-2 bg-white/90 backdrop-blur-xl rounded-full hover:bg-white transition-colors duration-300 cursor-pointer hover:scale-110 shadow-xl border border-white/50">
              <Share2 className="h-4 w-4 text-blue-600 drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]" />
            </div>
          </div>
          
          {featured && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white animate-pulse shadow-2xl shadow-pink-500/50 border-2 border-white/30 font-black">
              <TrendingUp className="h-3 w-3 mr-1 drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]" />
              Featured
            </Badge>
          )}
          
          {/* Premium Reading Time Badge */}
          <Badge className="absolute bottom-3 left-3 bg-black/80 text-white backdrop-blur-xl shadow-xl border border-white/20 font-bold">
            <Clock className="h-3 w-3 mr-1" />
            {Math.ceil((post.content?.length || 1000) / 200)} min read
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-center gap-2 text-sm mb-3 flex-wrap">
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-xl px-2 py-1 rounded-full border border-white/30">
            <Calendar className="h-3 w-3 text-pink-300" />
            <span className="text-xs font-bold text-white">{formatDate(post.published_at)}</span>
          </div>
          <div className="flex items-center gap-1 bg-blue-500/20 backdrop-blur-xl px-2 py-1 rounded-full border border-blue-400/30">
            <User className="h-3 w-3 text-blue-300" />
            <span className="text-xs font-bold text-blue-200">{post.author}</span>
          </div>
          {post.view_count > 0 && (
            <div className="flex items-center gap-1 bg-green-500/20 backdrop-blur-xl px-2 py-1 rounded-full border border-green-400/30">
              <Eye className="h-3 w-3 text-green-300" />
              <span className="text-xs font-bold text-green-200">{post.view_count} views</span>
            </div>
          )}
        </div>
        
        <h3 className={`font-black text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-300 group-hover:to-purple-300 group-hover:bg-clip-text transition-all duration-300 ${featured ? 'text-xl' : 'text-lg'} leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]`}>
          <Link to={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h3>
      </CardHeader>
      
      <CardContent className="pt-0 relative z-10">
        <p className="text-white/80 mb-6 line-clamp-3 leading-relaxed group-hover:text-white transition-colors duration-300 font-medium">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {post.category && (
              <Badge 
                variant="outline" 
                className="text-xs bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-400/50 text-pink-200 hover:scale-105 transition-transform duration-300 backdrop-blur-xl font-bold"
              >
                {post.category}
              </Badge>
            )}
            {post.tags && post.tags.slice(0, 2).map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-pink-500/20 hover:text-pink-200 hover:border-pink-400/50 transition-all duration-300 hover:scale-105 font-medium"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
          
          <Link to={`/blog/${post.slug}`}>
            <Button 
              variant="outline" 
              size="sm"
              className={`transition-all duration-500 hover:scale-110 font-bold border-2 ${
                hoveredCard === post.id 
                  ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white border-white/30 shadow-2xl shadow-pink-500/50' 
                  : 'bg-white/10 backdrop-blur-xl border-white/20 text-white hover:border-pink-400/50 hover:text-pink-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]'
              }`}
            >
              Read More
              <TrendingUp className="h-3 w-3 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="relative w-20 h-20 mb-8">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-white/20"></div>
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-pink-400 border-t-transparent animate-delay-300 shadow-[0_0_20px_rgba(236,72,153,0.6)]"></div>
              <div className="absolute inset-4 animate-pulse rounded-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-40"></div>
            </div>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <BookOpen className="h-6 w-6 text-pink-400 animate-bounce drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
                <span className="text-xl text-white font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Loading blog posts</span>
              </div>
              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce animate-delay-100 shadow-[0_0_10px_rgba(236,72,153,0.8)]"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animate-delay-200 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce animate-delay-300 shadow-[0_0_10px_rgba(236,72,153,0.8)]"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 relative overflow-hidden">
      <Header />
      
      {/* GOD-LEVEL Floating Particles Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-pink-500/30 via-rose-500/20 to-purple-500/30 rounded-full animate-float blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-purple-500/25 via-pink-500/20 to-rose-500/25 rounded-full animate-float blur-3xl" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-rose-400/30 to-pink-500/40 rounded-full animate-pulse blur-2xl"></div>
        
        {/* Floating Particles */}
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-pink-400 rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.3
            }}
          ></div>
        ))}
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30"></div>
      </div>
      
      {/* Premium Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50 backdrop-blur-sm">
        <div 
          className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 transition-all duration-300 shadow-[0_0_20px_rgba(236,72,153,0.6)]"
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      {/* Parallax Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute top-32 left-10 w-24 h-24 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full opacity-20 animate-float animate-delay-100"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        ></div>
        <div 
          className="absolute top-64 right-20 w-16 h-16 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-30 animate-float animate-delay-300"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        ></div>
        <div 
          className="absolute bottom-32 left-1/3 w-32 h-32 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full opacity-15 animate-float animate-delay-500"
          style={{ transform: `translateY(${scrollY * 0.25}px)` }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* GOD-LEVEL Enhanced Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 opacity-20 blur-3xl animate-pulse"></div>
            
            {/* Premium Subtitle Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-pink-500/30 mb-6 animate-fade-in-up">
              <BookOpen className="h-5 w-5 fill-pink-400 text-pink-400 animate-pulse" />
              <span className="text-sm font-bold tracking-widest uppercase bg-gradient-to-r from-pink-200 via-rose-200 to-pink-100 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(244,114,182,0.5)]">
                ✨ Stories & Inspiration ✨
              </span>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
            </div>
            
            {/* 3D Title Effect */}
            <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-6">
              <span className="block relative inline-block group">
                <span className="relative z-10 bg-gradient-to-r from-pink-300 via-rose-400 to-pink-500 bg-clip-text text-transparent animate-shimmer font-extrabold" style={{ textShadow: '0 0 60px rgba(236,72,153,0.8), 0 0 100px rgba(244,114,182,0.6)' }}>
                  Charmntreats Blog
                </span>
                {/* 3D Shadow Layers */}
                <span className="absolute top-1 left-1 bg-gradient-to-r from-pink-600 via-rose-700 to-pink-800 bg-clip-text text-transparent opacity-30 blur-sm" aria-hidden="true">
                  Charmntreats Blog
                </span>
                <span className="absolute top-2 left-2 bg-gradient-to-r from-pink-800 via-rose-900 to-pink-900 bg-clip-text text-transparent opacity-20 blur-md" aria-hidden="true">
                  Charmntreats Blog
                </span>
                <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/20 via-rose-500/30 to-pink-500/20 rounded-3xl blur-3xl -z-10"></div>
              </span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] animate-fade-in-up">
              Discover the art of handcrafted treasures, DIY tutorials, and creative inspiration from our community of artisans
            </p>
            
            {/* Premium Stats Row */}
            <div className="flex justify-center space-x-8 mb-8 animate-fade-in animate-delay-600">
              <div className="text-center group">
                <div className="text-3xl font-black bg-gradient-to-r from-pink-300 to-rose-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(236,72,153,0.8)] group-hover:scale-110 transition-transform duration-300">{posts.length}+</div>
                <div className="text-sm text-white/70 font-bold">Articles</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-black bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.8)] group-hover:scale-110 transition-transform duration-300">{categories.length}+</div>
                <div className="text-sm text-white/70 font-bold">Categories</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-black bg-gradient-to-r from-pink-300 to-rose-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(236,72,153,0.8)] group-hover:scale-110 transition-transform duration-300">10K+</div>
                <div className="text-sm text-white/70 font-bold">Readers</div>
              </div>
            </div>
            
            <a 
              href="https://www.charmntreats.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block animate-fade-in animate-delay-800"
            >
              <Button className="px-8 py-4 text-lg bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white border-2 border-white/30 hover:scale-110 transition-all duration-300 shadow-2xl shadow-pink-500/50 hover:shadow-pink-500/80 font-black drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                Visit Our Main Website →
              </Button>
            </a>
          </div>
        </div>

        {/* GOD-LEVEL Search and Filter */}
        <div className="mb-12 space-y-6 animate-fade-in animate-delay-1000">
          <div className="flex gap-4 max-w-3xl mx-auto">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-pink-300 group-focus-within:text-pink-400 transition-colors duration-300 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
              <Input
                placeholder="Search for crafting tips, tutorials, inspiration..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg bg-white/10 backdrop-blur-xl border-2 border-white/20 focus:border-pink-400/50 focus:ring-pink-400/30 rounded-xl transition-all duration-300 text-white placeholder:text-white/50 font-medium shadow-xl hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              onClick={handleSearch} 
              className="px-8 py-3 text-lg bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white border-2 border-white/30 hover:scale-110 transition-all duration-300 shadow-2xl shadow-pink-500/50 hover:shadow-pink-500/80 rounded-xl font-black"
            >
              <Search className="h-5 w-5 mr-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]" />
              Search
            </Button>
          </div>

          {/* GOD-LEVEL Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryFilter('')}
              className={`transition-all duration-300 hover:scale-110 rounded-full px-6 py-2 font-bold border-2 ${
                selectedCategory === '' 
                  ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white border-white/30 shadow-2xl shadow-pink-500/50' 
                  : 'bg-white/10 backdrop-blur-xl border-white/20 text-white hover:border-pink-400/50 hover:text-pink-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]'
              }`}
            >
              All Posts
            </Button>
            {categories.map((category, index) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.slug ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryFilter(category.slug)}
                className={`transition-all duration-300 hover:scale-110 rounded-full px-6 py-2 font-bold border-2 animate-fade-in animate-delay-${(index + 1) * 100} ${
                  selectedCategory === category.slug 
                    ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white border-white/30 shadow-2xl shadow-pink-500/50' 
                    : 'bg-white/10 backdrop-blur-xl border-white/20 text-white hover:border-pink-400/50 hover:text-pink-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]'
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* GOD-LEVEL Featured Posts */}
        {featuredPosts.length > 0 && selectedCategory === '' && !searchTerm && (
          <div className="mb-16 animate-fade-in animate-delay-1200">
            <div className="text-center mb-10">
              <h2 className="text-5xl font-black mb-4">
                <span className="bg-gradient-to-r from-pink-300 via-rose-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(236,72,153,0.8)]" style={{ textShadow: '0 0 40px rgba(236,72,153,0.6)' }}>
                  ✨ Featured Posts
                </span>
              </h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                Hand-picked articles that our readers love most
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.map((post, index) => (
                <BlogPostCard key={post.id} post={post} featured={true} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* GOD-LEVEL All Posts */}
        <div className="mb-16 animate-fade-in animate-delay-1400">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black mb-4">
              <span className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                {searchTerm ? (
                  <>🔍 Search Results for <span className="bg-gradient-to-r from-pink-300 to-rose-400 bg-clip-text text-transparent">"{searchTerm}"</span></>
                ) : selectedCategory ? (
                  <>📂 Posts in <span className="bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent">{categories.find(c => c.slug === selectedCategory)?.name}</span></>
                ) : (
                  <>📚 Latest Posts</>
                )}
              </span>
            </h2>
            {posts.length > 0 && (
              <p className="text-lg text-white/80 font-medium">
                Showing {posts.length} {posts.length === 1 ? 'post' : 'posts'}
              </p>
            )}
          </div>

          {posts.length === 0 ? (
            <Card className="text-center py-16 bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300 animate-fade-in">
              <CardContent>
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <BookOpen className="h-24 w-24 text-slate-400 animate-bounce" />
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 opacity-10 rounded-full blur-xl"></div>
                </div>
                <h3 className="text-2xl font-bold text-slate-600 mb-4">
                  {searchTerm ? '🔍 No posts found' : '📝 No blog posts yet'}
                </h3>
                <p className="text-lg text-slate-500 mb-6 max-w-md mx-auto">
                  {searchTerm 
                    ? 'Try adjusting your search terms or browse all posts to discover amazing content.' 
                    : 'Our writers are crafting amazing content. Check back soon for new posts!'}
                </p>
                {searchTerm && (
                  <Button 
                    onClick={() => {
                      setSearchTerm('');
                      fetchBlogData();
                    }}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 rounded-full hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    View All Posts
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <BlogPostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Categories Overview */}
        {categories.length > 0 && selectedCategory === '' && !searchTerm && (
          <div className="mt-20 animate-fade-in animate-delay-1600">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                🎨 Explore Categories
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Dive into specific topics and discover curated content
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category, index) => (
                <Card 
                  key={category.id} 
                  className={`group relative overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer hover:scale-105 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-pink-300 animate-slide-up animate-delay-${(index % 3) * 200 + 200}`}
                  onClick={() => handleCategoryFilter(category.slug)}
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardContent className="p-8 text-center relative z-10">
                    {/* Category Icon */}
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Tag className="h-8 w-8 text-pink-600 group-hover:text-purple-600 transition-colors duration-300" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                      {category.name}
                    </h3>
                    <p className="text-slate-600 group-hover:text-slate-700 transition-colors duration-300 mb-4">
                      {category.description}
                    </p>
                    
                    {/* Hover Arrow */}
                    <div className="flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <span className="text-pink-600 font-medium">Explore</span>
                      <TrendingUp className="h-4 w-4 text-pink-600" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Blog;