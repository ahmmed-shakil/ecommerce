import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Shield, Truck } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSelectedCategory } from "@/store/slices/productsSlice";
import heroBanner from "@/assets/hero-banner.jpg";

const Hero = () => {
  const dispatch = useDispatch();

  const handleShopNow = () => {
    dispatch(setSelectedCategory("all"));
    // Scroll to products section
    const productsSection = document.getElementById("products-section");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleViewCatalog = () => {
    dispatch(setSelectedCategory("all"));
    // Scroll to products section
    const productsSection = document.getElementById("products-section");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                ⚡ Limited Time Offer
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-secondary-foreground leading-tight">
                Latest Tech
                <span className="block bg-gradient-primary bg-clip-text text-transparent">
                  Gadgets & Gear
                </span>
              </h1>
              <p className="text-lg text-secondary-foreground/80 max-w-md">
                Discover cutting-edge technology and premium gadgets. From
                smartphones to laptops, find everything you need to stay
                connected and productive.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold group"
                onClick={handleShopNow}
              >
                Shop Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-border/30 text-secondary hover:bg-secondary-foreground/5 px-8 py-3 text-lg"
                onClick={handleViewCatalog}
              >
                View Catalog
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="flex items-center gap-3">
                <div className="bg-accent/10 p-2 rounded-lg">
                  <Truck className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-secondary-foreground">
                    Free Shipping
                  </p>
                  <p className="text-sm text-secondary-foreground/60">
                    On orders $99+
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-success/10 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="font-medium text-secondary-foreground">
                    Warranty
                  </p>
                  <p className="text-sm text-secondary-foreground/60">
                    2-year coverage
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-secondary-foreground">
                    Fast Delivery
                  </p>
                  <p className="text-sm text-secondary-foreground/60">
                    2-day shipping
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-slide-up">
            <div className="relative z-10">
              <img
                src={heroBanner}
                alt="Latest tech gadgets"
                className="w-full h-auto rounded-2xl shadow-tech"
              />

              {/* Floating badges */}
              <div className="absolute top-6 left-6 animate-float">
                <Badge className="bg-background/90 text-foreground backdrop-blur-sm border-border/20">
                  🔥 Hot Deals
                </Badge>
              </div>

              <div
                className="absolute bottom-6 right-6 animate-float"
                style={{ animationDelay: "1s" }}
              >
                <Badge className="bg-primary text-primary-foreground">
                  ✨ Premium Quality
                </Badge>
              </div>
            </div>

            {/* Background decorations */}
            <div className="absolute -inset-4 bg-gradient-primary opacity-20 rounded-3xl blur-xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>

      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>
    </section>
  );
};

export default Hero;
