import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import AuthDebug from "@/components/AuthDebug";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { useEffect, lazy, Suspense } from "react";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";

// Lazy load pages for better performance and code splitting
const Index = lazy(() => import("./pages/Index"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));
const TestEmails = lazy(() => import("./pages/TestEmails"));
const EmailTest = lazy(() => import("./pages/EmailTest"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const Vlog = lazy(() => import("./pages/Vlog"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const ProfileAddress = lazy(() => import("./pages/ProfileAddress"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
const AddressDemo = lazy(() => import("./pages/AddressDemo"));
const DreamCatcher = lazy(() => import("./pages/blogDetails/DreamCatcher"));
const Embroidery = lazy(() => import("./pages/blogDetails/Embroidery"));
const LippanArt = lazy(() => import("./pages/blogDetails/LippanArt"));
const ResinArt = lazy(() => import("./pages/blogDetails/ResinArt"));
const CandleMaking = lazy(() => import("./pages/blogDetails/CandleMaking"));
const Calligraphy = lazy(() => import("./pages/blogDetails/Calligraphy"));
const HairAccessories = lazy(() => import("./pages/blogDetails/HairAccessories"));
const OthersDelivery = lazy(() => import("./pages/blogDetails/OthersDelivery"));

// Optimized QueryClient for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

// Loading component with smooth animation
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#fadde1]">
    <div className="w-16 h-16 border-4 border-white/30 border-t-rose-500 rounded-full animate-spin"></div>
  </div>
);

// Component to handle scroll to top on route change with optimized performance
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use requestAnimationFrame for smooth scrolling
    const scrollToTop = () => {
      window.requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant' // Instant for route changes
        });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
    };

    scrollToTop();
  }, [pathname]);

  return null;
};

// Performance optimization wrapper
const PerformanceWrapper = ({ children }: { children: React.ReactNode }) => {
  usePerformanceOptimization();
  return <>{children}</>;
};

import PageTransition from "@/components/Layout/PageTransition";

// ...existing code...

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <PerformanceWrapper>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <Suspense fallback={<PageLoader />}>
                  <PageTransition>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                      <Route path="/order-history" element={<OrderHistory />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/profile/address" element={<ProfileAddress />} />
                      <Route path="/track-order" element={<TrackOrder />} />
                      <Route path="/address-demo" element={<AddressDemo />} />
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
                  </PageTransition>
                </Suspense>
                <AuthDebug />
              </BrowserRouter>
            </PerformanceWrapper>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
