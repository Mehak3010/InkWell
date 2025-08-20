import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Bookmark, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";

const BlogPost = () => {
  const { id } = useParams();

  // Mock blog post data - will be replaced with Supabase data
  const mockPost = {
    title: "The Future of Web Development: What's Coming in 2024",
    content: `
      <p>Web development is evolving at an unprecedented pace, and 2024 promises to bring exciting new technologies and methodologies that will reshape how we build digital experiences.</p>
      
      <h2>AI Integration Becomes Standard</h2>
      <p>Artificial Intelligence is no longer a luxury feature but a standard requirement in modern web applications. From chatbots to personalized content recommendations, AI is becoming deeply integrated into the web development workflow.</p>
      
      <h2>The Rise of Edge Computing</h2>
      <p>Edge computing is revolutionizing how we think about performance and user experience. By processing data closer to users, we can achieve unprecedented speed and reliability.</p>
      
      <h2>WebAssembly Goes Mainstream</h2>
      <p>WebAssembly (WASM) is finally hitting its stride, allowing developers to run high-performance applications directly in browsers with near-native speed.</p>
      
      <p>The future looks incredibly bright for web developers willing to embrace these emerging technologies.</p>
    `,
    author: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      bio: "Senior Frontend Developer at TechCorp"
    },
    publishedAt: "2 days ago",
    readTime: "5 min read",
    category: "Technology",
    likes: 342,
    comments: 28,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop"
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            {mockPost.category}
          </span>
          
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            {mockPost.title}
          </h1>

          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={mockPost.author.avatar} />
                <AvatarFallback>{mockPost.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{mockPost.author.name}</p>
                <p className="text-muted-foreground text-sm">{mockPost.author.bio}</p>
                <p className="text-muted-foreground text-sm">{mockPost.publishedAt} • {mockPost.readTime}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                {mockPost.likes}
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                {mockPost.comments}
              </Button>
              <Button variant="ghost" size="sm">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {mockPost.image && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img 
              src={mockPost.image} 
              alt={mockPost.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
        )}

        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: mockPost.content }}
        />
      </article>
    </div>
  );
};

export default BlogPost;