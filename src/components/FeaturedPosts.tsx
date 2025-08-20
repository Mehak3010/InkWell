import BlogCard from "./BlogCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FeaturedPosts = () => {
  const mockPosts = [
    {
      id: "1",
      title: "The Future of Web Development: What's Coming in 2024",
      excerpt: "Explore the latest trends and technologies that are shaping the future of web development, from AI integration to new frameworks.",
      author: {
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
      },
      category: "Technology",
      readTime: "5 min read",
      publishedAt: "2 days ago",
      likes: 342,
      comments: 28,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop"
    },
    {
      id: "2",
      title: "Building Sustainable Habits That Actually Stick",
      excerpt: "Learn the science-backed strategies for creating lasting positive changes in your life, without overwhelming yourself.",
      author: {
        name: "Marcus Johnson",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      category: "Lifestyle",
      readTime: "7 min read",
      publishedAt: "1 week ago",
      likes: 289,
      comments: 45,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop"
    },
    {
      id: "3",
      title: "The Art of Minimalist Design in Modern Applications",
      excerpt: "Discover how less can be more when it comes to creating beautiful, functional user interfaces that users love.",
      author: {
        name: "Emma Rodriguez",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
      },
      category: "Design",
      readTime: "4 min read",
      publishedAt: "3 days ago",
      likes: 156,
      comments: 19,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop"
    },
    {
      id: "4",
      title: "Remote Work Revolution: Tips from Digital Nomads",
      excerpt: "Get insider tips from experienced digital nomads on how to work effectively while traveling the world.",
      author: {
        name: "Alex Thompson",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      },
      category: "Career",
      readTime: "6 min read",
      publishedAt: "5 days ago",
      likes: 203,
      comments: 32,
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=400&fit=crop"
    }
  ];

  const categories = ["All", "Technology", "Lifestyle", "Design", "Career"];

  return (
    <section className="py-20 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading">Featured Stories</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover the most engaging and inspiring content from our community of writers
          </p>
        </div>

        <Tabs defaultValue="All" className="w-full">
          <TabsList className="grid w-full grid-cols-5 max-w-md mx-auto mb-12">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="text-sm">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                {mockPosts
                  .filter(post => category === "All" || post.category === category)
                  .map((post, index) => (
                    <BlogCard key={index} {...post} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default FeaturedPosts;