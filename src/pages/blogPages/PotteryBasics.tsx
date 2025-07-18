import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PotteryBasics = () => {
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
            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
            alt="Pottery Basics"
            className="w-full h-64 md:h-80 object-cover"
          />
          
          <div className="p-8">
            <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>December 5, 2024</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Meera Joshi</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Pottery Basics: Your First Steps into Clay Art
            </h1>

            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="outline">Pottery</Badge>
              <Badge variant="secondary">
                <Tag className="h-3 w-3 mr-1" />
                Ceramics
              </Badge>
              <Badge variant="secondary">
                <Tag className="h-3 w-3 mr-1" />
                Handbuilding
              </Badge>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-600 italic mb-6 p-4 bg-slate-50 rounded-lg border-l-4 border-amber-500">
                Discover the ancient art of pottery and learn how to transform simple clay into beautiful, functional pieces.
              </p>

              <h2>The Magic of Clay</h2>
              <p>
                Pottery is one of humanity's oldest crafts, dating back thousands of years. Working with clay connects 
                us to this rich tradition while offering endless possibilities for creative expression. Whether you're 
                making functional bowls or decorative sculptures, pottery combines artistry with practicality.
              </p>

              <h2>Types of Clay</h2>
              
              <h3>Earthenware</h3>
              <p>
                Low-fire clay that's easy to work with and perfect for beginners. It fires at lower temperatures 
                and has a porous, rustic quality.
              </p>

              <h3>Stoneware</h3>
              <p>
                Mid to high-fire clay that's durable and versatile. Great for functional pottery like bowls, 
                mugs, and plates.
              </p>

              <h3>Porcelain</h3>
              <p>
                High-fire clay that's smooth, white, and translucent when thin. More challenging to work with 
                but creates elegant, refined pieces.
              </p>

              <h2>Essential Tools for Beginners</h2>
              <ul>
                <li><strong>Clay:</strong> Start with 5-10 pounds of stoneware or earthenware</li>
                <li><strong>Wire tool:</strong> For cutting clay</li>
                <li><strong>Wooden ribs:</strong> For smoothing and shaping</li>
                <li><strong>Sponges:</strong> For smoothing and adding water</li>
                <li><strong>Needle tool:</strong> For trimming and detail work</li>
                <li><strong>Canvas or bat:</strong> Work surface</li>
                <li><strong>Plastic bags:</strong> To keep clay moist</li>
              </ul>

              <h2>Basic Hand-Building Techniques</h2>
              
              <h3>1. Pinch Pots</h3>
              <p>
                Start with a ball of clay and use your thumb to create a hollow center. Pinch the walls 
                gradually, rotating as you work. This is perfect for small bowls and cups.
              </p>

              <h3>2. Coil Building</h3>
              <p>
                Roll clay into long coils and stack them to build walls. Blend the coils together for 
                strength. Great for larger vessels and sculptural forms.
              </p>

              <h3>3. Slab Construction</h3>
              <p>
                Roll clay into flat sheets and cut shapes to construct boxes, tiles, or architectural forms. 
                Join pieces using slip (liquid clay) and scoring.
              </p>

              <h2>The Pottery Process</h2>
              
              <h3>1. Forming (Wet Stage)</h3>
              <p>Shape your piece using hand-building techniques or a pottery wheel.</p>

              <h3>2. Leather Hard Stage</h3>
              <p>Clay is firm but still workable. Perfect time for trimming, carving, and adding handles.</p>

              <h3>3. Bone Dry Stage</h3>
              <p>Clay is completely dry and ready for the first firing (bisque firing).</p>

              <h3>4. Bisque Firing</h3>
              <p>First firing that makes clay hard and porous, ready for glazing.</p>

              <h3>5. Glazing</h3>
              <p>Apply glaze for color, texture, and waterproofing.</p>

              <h3>6. Glaze Firing</h3>
              <p>Final firing that melts the glaze and completes your piece.</p>

              <h2>Tips for Success</h2>
              <ul>
                <li>Keep clay covered with damp cloth when not working</li>
                <li>Work slowly and patiently - rushing leads to cracks</li>
                <li>Join clay pieces properly with slip and scoring</li>
                <li>Allow pieces to dry slowly and evenly</li>
                <li>Start with simple forms before attempting complex shapes</li>
                <li>Keep a pottery journal to track glazes and techniques</li>
              </ul>

              <h2>Common Beginner Challenges</h2>
              
              <h3>Cracking</h3>
              <p>Usually caused by uneven drying or clay that's too dry. Keep work covered and dry slowly.</p>

              <h3>Warping</h3>
              <p>Happens when clay dries unevenly. Support pieces properly and dry in a draft-free area.</p>

              <h3>Glaze Issues</h3>
              <p>Practice glaze application on test pieces first. Keep glazes well-mixed and apply evenly.</p>

              <h2>Finding Your Style</h2>
              <p>
                Pottery offers endless possibilities for personal expression. Some potters focus on functional 
                ware, others on sculptural forms. Experiment with different techniques, glazes, and forms to 
                discover what speaks to you.
              </p>

              <p>
                Remember, every potter started as a beginner. Embrace the learning process, celebrate small 
                victories, and don't be discouraged by imperfections - they often become the most interesting 
                features of handmade pottery.
              </p>
            </div>
          </div>
        </article>
      </div>

      <Footer />
    </div>
  );
};

export default PotteryBasics;