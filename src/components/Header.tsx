import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PenTool, User, Search, LayoutDashboard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/images/43120cc5-a7a7-4485-a98a-9501631df39f.png"
            alt="InkWell Logo"
            className="h-8 w-8"
          />
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-black font-heading">
            InkWell
          </h1>
        </Link>

        <div className="flex items-center space-x-4 flex-1 max-w-md mx-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black" />
            <Input
              placeholder="Search articles..."
              className="pl-10 text-black"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-black">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          {!user && (
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="text-black">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
          )}
          <Link to="/write">
            <Button variant="default" size="sm" className="text-black">
              Write
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;