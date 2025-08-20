import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogCardProps {
  id?: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: string;
  readTime: string;
  publishedAt: string;
  likes: number;
  comments: number;
  image?: string;
}

const BlogCard = ({ 
  id = "1",
  title, 
  excerpt, 
  author, 
  category, 
  readTime, 
  publishedAt, 
  likes, 
  comments,
  image 
}: BlogCardProps) => {
  return (
    <Link to={`/blog/${id}`} className="block">
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-elegant hover:-translate-y-1 cursor-pointer border-0 shadow-card">
      {image && (
        <div className="aspect-[16/10] overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      )}
      
      <CardHeader className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs font-medium px-3 py-1">
            {category}
          </Badge>
          <span className="text-xs text-muted-foreground font-medium">{readTime}</span>
        </div>
        
        <h3 className="text-xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors font-heading">
          {title}
        </h3>
      </CardHeader>

      <CardContent className="px-6 pb-4">
        <p className="text-muted-foreground line-clamp-3 leading-relaxed">
          {excerpt}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between p-6 pt-0">
        <div className="flex items-center space-x-3">
          <Avatar className="h-9 w-9 ring-2 ring-background shadow-sm">
            <AvatarImage src={author.avatar} />
            <AvatarFallback className="text-xs font-medium">{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">{author.name}</p>
            <p className="text-muted-foreground text-xs">{publishedAt}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="h-9 px-3 hover:bg-background/80">
            <Heart className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">{likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-9 px-3 hover:bg-background/80">
            <MessageCircle className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">{comments}</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-9 px-2 hover:bg-background/80">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
    </Link>
  );
};

export default BlogCard;