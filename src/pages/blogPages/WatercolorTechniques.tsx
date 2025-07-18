import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const WatercolorTechniques = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Link to="/blog">
          <Button variant="outline" size="sm" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
            alt="Watercolor Techniques"
            className="w-full h-64 md:h-80 object-cover"
          />
          
          <div className="p-8">
            <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>December 10, 2024</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Aditya Patel</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Mastering Watercolor Techniques: A Beginner's Journey
            </h1>

            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="outline">Watercolor</Badge>
              <Badge variant="secondary">
                <Tag className="h-3 w-3 mr-1" />
                Painting
              </Badge>
              <Badge variant="secondary">
                <Tag className="h-3 w-3 mr-1" />
                Art Techniques
              </Badge>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-600 italic mb-6 p-4 bg-slate-50 rounded-lg border-l-4 border-amber-500">
                Dive into the fluid, expressive world of watercolor painting and discover techniques that will transform your artistic practice.
              </p>

              <h2>Why Choose Watercolors?</h2>
              <p>
                Watercolor painting offers a unique blend of control and spontaneity. The medium's transparency and fluidity 
                create effects that are impossible to achieve with other paints, making it perfect for capturing light, 
                atmosphere, and emotion.
              </p>

              <h2>Essential Watercolor Supplies</h2>
              <ul>
                <li><strong>Paints:</strong> Start with a basic set of 12-24 colors</li>
                <li><strong>Brushes:</strong> Round brushes in sizes 6, 10, and 14</li>
                <li><strong>Paper:</strong> 140lb watercolor paper (cold-pressed recommended)</li>
                <li><strong>Palette:</strong> Ceramic or plastic mixing palette</li>
                <li><strong>Water containers:</strong> Two jars (one for clean, one for dirty water)</li>
                <li><strong>Sponges and paper towels:</strong> For blotting and texture effects</li>
              </ul>

              <h2>Fundamental Techniques</h2>
              
              <h3>1. Wet-on-Wet</h3>
              <p>
                Apply wet paint to wet paper or wet paint. This creates soft, flowing effects perfect for skies, 
                water, and atmospheric backgrounds. The paint will spread and blend naturally.
              </p>

              <h3>2. Wet-on-Dry</h3>
              <p>
                Apply wet paint to dry paper. This gives you more control and creates crisp, defined edges. 
                Perfect for details and sharp contrasts.
              </p>

              <h3>3. Dry Brush Technique</h3>
              <p>
                Use a brush with minimal water to create textured, scratchy effects. Great for tree bark, 
                grass, and other rough textures.
              </p>

              <h3>4. Glazing</h3>
              <p>
                Layer transparent washes of color over dried paint to build depth and complexity. 
                Each layer should be completely dry before applying the next.
              </p>

              <h2>Color Mixing Basics</h2>
              <ul>
                <li>Start with primary colors: red, blue, and yellow</li>
                <li>Mix colors on your palette, not on the paper</li>
                <li>Test colors on scrap paper first</li>
                <li>Remember that watercolors dry lighter than they appear when wet</li>
                <li>Keep a color mixing chart for reference</li>
              </ul>

              <h2>Common Beginner Mistakes to Avoid</h2>
              <ol>
                <li><strong>Using too much water:</strong> Start with less water and add more as needed</li>
                <li><strong>Working too fast:</strong> Allow layers to dry completely between applications</li>
                <li><strong>Overworking the paint:</strong> Sometimes less is more in watercolor</li>
                <li><strong>Using cheap paper:</strong> Good paper makes a huge difference in results</li>
                <li><strong>Not planning light areas:</strong> Remember, you can't add white paint in traditional watercolor</li>
              </ol>

              <h2>Practice Exercises</h2>
              
              <h3>Exercise 1: Color Swatches</h3>
              <p>Create swatches of each color in your palette, both at full strength and diluted with water.</p>

              <h3>Exercise 2: Gradient Washes</h3>
              <p>Practice creating smooth gradients from dark to light using the wet-on-wet technique.</p>

              <h3>Exercise 3: Simple Shapes</h3>
              <p>Paint basic shapes like circles, squares, and triangles using different techniques.</p>

              <h2>Building Your Skills</h2>
              <p>
                Watercolor mastery comes with practice and patience. Start with simple subjects like fruits, 
                flowers, or landscapes. Focus on understanding how water and pigment interact rather than 
                creating perfect paintings.
              </p>

              <p>
                Remember, every "mistake" in watercolor can become a happy accident that leads to new discoveries. 
                Embrace the unpredictability and let the medium guide your artistic journey.
              </p>
            </div>
          </div>
        </article>
      </div>

      <Footer />
    </div>
  );
};

export default WatercolorTechniques;