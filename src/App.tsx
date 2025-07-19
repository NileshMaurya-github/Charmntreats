import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AuthDebug from "@/components/AuthDebug";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderHistory from "./pages/OrderHistory";
import TestEmails from "./pages/TestEmails";
import EmailTest from "./pages/EmailTest";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Vlog from "./pages/Vlog";
import AboutUs from "./pages/AboutUs";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import DreamCatcher from "./pages/blogDetails/DreamCatcher";
import Embroidery from "./pages/blogDetails/Embroidery";
import LippanArt from "./pages/blogDetails/LippanArt";
import ResinArt from "./pages/blogDetails/ResinArt";
import CandleMaking from "./pages/blogDetails/CandleMaking";
import Calligraphy from "./pages/blogDetails/Calligraphy";
import HairAccessories from "./pages/blogDetails/HairAccessories";
import OthersDelivery from "./pages/blogDetails/OthersDelivery";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
              <Route path="/order-history" element={<OrderHistory />} />
              <Route path="/test-emails" element={<TestEmails />} />
              <Route path="/email-test" element={<EmailTest />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/vlog" element={<Vlog />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route path="/blogDetails/DreamCatcher" element={<DreamCatcher />} />
              <Route path="/blogDetails/Embroidery" element={<Embroidery />} />
              <Route path="/blogDetails/LippanArt" element={<LippanArt />} />
              <Route path="/blogDetails/ResinArt" element={<ResinArt />} />
              <Route path="/blogDetails/CandleMaking" element={<CandleMaking />} />
              <Route path="/blogDetails/Calligraphy" element={<Calligraphy />} />
              <Route path="/blogDetails/HairAccessories" element={<HairAccessories />} />
              <Route path="/blogDetails/OthersDelivery" element={<OthersDelivery />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <AuthDebug />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
