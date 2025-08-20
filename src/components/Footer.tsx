import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PenTool, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/images/43120cc5-a7a7-4485-a98a-9501631df39f.png" 
                alt="InkWell Logo" 
                className="h-6 w-6"
              />
              <span className="text-xl font-bold">InkWell</span>
            </div>
            <p className="text-muted-foreground">
              A platform where ideas flourish and stories connect people from around the world.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Explore</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Popular Posts</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Recent Stories</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Top Authors</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Categories</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Community</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Write for Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Guidelines</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Stay Updated</h3>
            <p className="text-muted-foreground text-sm">
              Get the latest stories delivered to your inbox.
            </p>
            <div className="space-y-2">
              <Input placeholder="Enter your email" />
              <Button className="w-full">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
          <p>&copy; 2024 InkWell. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;