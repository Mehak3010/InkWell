import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/blog-hero.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-black/20" />
      <div 
        className="absolute inset-0 bg-cover bg-center mix-blend-overlay"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      <div className="relative container mx-auto px-4 py-24 text-center text-white">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
            <Sparkles className="mr-2 h-4 w-4" />
            <span className="text-sm font-medium">Share Your Stories</span>
          </div>
          
          <h1 className="mb-8 text-5xl font-bold leading-tight md:text-7xl font-heading">
            Where Ideas Come to{" "}
            <span className="bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
              Life
            </span>
          </h1>
          
          <p className="mb-10 text-xl text-white/90 md:text-2xl leading-relaxed max-w-3xl mx-auto">
            Discover amazing stories, connect with passionate writers, and share your unique perspective with the world.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" className="group">
              Start Reading
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
              Start Writing
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;