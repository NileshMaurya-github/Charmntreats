import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const HandmadeJewelryGuide = () => {
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
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
            alt="Handmade Jewelry Guide"
            className="w-full h-64 md:h-80 object-cover"
          />
          
          <div className="p-8">
            <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>November 28, 2024</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Kavya Reddy</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Handmade Jewelry: Creating Wearable Art
            </h1>

            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="outline">Jewelry Making</Badge>
              <Badge variant="secondary">
                <Tag className="h-3 w-3 mr-1" />
                Accessories
              </Badge>
              <Badge variant="secondary">
                <Tag className="h-3 w-3 mr-1" />
                Wire Work
              </Badge>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-600 italic mb-6 p-4 bg-slate-50 rounded-lg border-l-4 border-amber-500">
                Transform simple materials into stunning jewelry pieces that reflect your personal style and creativity.
              </p>

              <h2>The Art of Handmade Jewelry</h2>
              <p>
                Creating handmade jewelry is a deeply personal form of artistic expression. Each piece tells a story, 
                carries meaning, and becomes a wearable work of art. Whether you're crafting for yourself, loved ones, 
                or as a business venture, jewelry making combines technical skill with creative vision.
              </p>

              <h2>Essential Tools and Materials</h2>
              
              <h3>Basic Tool Kit</h3>
              <ul>
                <li><strong>Pliers:</strong> Round-nose, flat-nose, and wire cutters</li>
                <li><strong>Files:</strong> For smoothing rough edges</li>
                <li><strong>Mandrels:</strong> For shaping rings and curves</li>
                <li><strong>Hammer:</strong> Ball-peen or chasing hammer</li>
                <li><strong>Bench block:</strong> Steel surface for hammering</li>
                <li><strong>Measuring tools:</strong> Ruler and ring sizer</li>
              </ul>

              <h3>Materials to Start With</h3>
              <ul>
                <li><strong>Wire:</strong> Sterling silver, copper, or craft wire in various gauges</li>
                <li><strong>Beads:</strong> Glass, stone, metal, or wooden beads</li>
                <li><strong>Findings:</strong> Jump rings, ear wires, clasps, and head pins</li>
                <li><strong>Chain:</strong> Various styles and metals</li>
                <li><strong>Cord:</strong> Leather, silk, or cotton for stringing</li>
              </ul>

              <h2>Fundamental Techniques</h2>
              
              <h3>1. Wire Wrapping</h3>
              <p>
                Learn to create loops, spirals, and decorative wraps. This technique is perfect for securing 
                stones, creating pendants, and adding decorative elements to your pieces.
              </p>

              <h3>2. Bead Stringing</h3>
              <p>
                Master the art of creating balanced, beautiful bead arrangements. Consider color, size, 
                texture, and weight when designing your pieces.
              </p>

              <h3>3. Jump Ring Connections</h3>
              <p>
                Properly opening and closing jump rings is crucial for professional-looking jewelry. 
                Always twist sideways, never pull apart.
              </p>

              <h3>4. Basic Metalwork</h3>
              <p>
                Learn to cut, file, and shape metal components. Start with soft metals like copper 
                before moving to precious metals.
              </p>

              <h2>Popular Jewelry Types for Beginners</h2>
              
              <h3>Earrings</h3>
              <p>
                Start with simple drop earrings or studs. They require fewer materials and are 
                quick to complete, giving you immediate satisfaction.
              </p>

              <h3>Bracelets</h3>
              <p>
                Wire-wrapped bracelets or beaded designs are perfect for practicing techniques 
                and experimenting with color combinations.
              </p>

              <h3>Necklaces</h3>
              <p>
                Begin with simple pendant necklaces or beaded strands. Focus on proportion 
                and balance in your designs.
              </p>

              <h3>Rings</h3>
              <p>
                Wire-wrapped rings are a great introduction to ring making. Practice sizing 
                and shaping techniques.
              </p>

              <h2>Design Principles</h2>
              
              <h3>Balance and Proportion</h3>
              <p>Consider the size relationship between different elements in your piece.</p>

              <h3>Color Harmony</h3>
              <p>Use color theory to create pleasing combinations or striking contrasts.</p>

              <h3>Texture and Contrast</h3>
              <p>Mix smooth and textured elements for visual interest.</p>

              <h3>Movement and Flow</h3>
              <p>Design pieces that move gracefully with the wearer.</p>

              <h2>Working with Different Materials</h2>
              
              <h3>Natural Stones</h3>
              <p>
                Each stone has unique properties. Learn about hardness, cleavage, and how 
                to work with different stone types safely.
              </p>

              <h3>Metals</h3>
              <p>
                Understand the properties of different metals - their malleability, tarnish 
                resistance, and compatibility with skin types.
              </p>

              <h3>Glass and Crystal</h3>
              <p>
                Handle with care and understand how different glass types behave under stress.
              </p>

              <h2>Finishing Techniques</h2>
              <ul>
                <li><strong>Polishing:</strong> Use appropriate compounds for different metals</li>
                <li><strong>Patination:</strong> Add color and depth to metal surfaces</li>
                <li><strong>Protective coatings:</strong> Prevent tarnish and wear</li>
                <li><strong>Quality control:</strong> Check all connections and smooth rough edges</li>
              </ul>

              <h2>Building Your Skills</h2>
              <p>
                Start with simple projects and gradually increase complexity. Practice basic 
                techniques until they become second nature. Study the work of established 
                jewelry artists for inspiration, but develop your own unique style.
              </p>

              <h2>Caring for Handmade Jewelry</h2>
              <ul>
                <li>Store pieces separately to prevent scratching</li>
                <li>Clean gently with appropriate methods for each material</li>
                <li>Remove jewelry before swimming, exercising, or cleaning</li>
                <li>Have pieces professionally maintained when needed</li>
              </ul>

              <h2>From Hobby to Business</h2>
              <p>
                Many jewelry makers eventually turn their passion into a business. Start by 
                creating pieces for friends and family, build a portfolio, and consider 
                selling at craft fairs or online platforms.
              </p>

              <p>
                Remember, every master jeweler started with their first simple piece. Focus 
                on learning, experimenting, and enjoying the creative process. Your unique 
                perspective and personal style will develop naturally as you continue to create.
              </p>
            </div>
          </div>
        </article>
      </div>

      <Footer />
    </div>
  );
};

export default HandmadeJewelryGuide;