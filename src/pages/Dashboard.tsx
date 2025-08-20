import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ArrowLeft, Edit, Trash, Eye, LogOut, User } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  publisherName: string;
  tags: string[];
  featuredImage: string | null;
  created_at: string;
  status: "published" | "draft";
}

const Dashboard = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      // Try to fetch from Supabase, filtering by the current user's ID
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setPosts(data.map((post: any) => ({
          ...post,
          status: post.status || "published", // Default to published for existing posts
        })));
      } else {
        // If no data in Supabase or table doesn't exist yet, fall back to localStorage
        const storedPosts = JSON.parse(localStorage.getItem("posts") || "[]");
        setPosts(storedPosts.map((post: any) => ({
          ...post,
          status: post.status || "published", // Default to published for existing posts
        })));
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      // Fallback to localStorage if Supabase fails
      const storedPosts = JSON.parse(localStorage.getItem("posts") || "[]");
      setPosts(storedPosts.map((post: any) => ({
        ...post,
        status: post.status || "published", // Default to published for existing posts
      })));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Try to delete from Supabase
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state after successful deletion
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
      
      // Fallback to localStorage if Supabase fails
      const storedPosts = JSON.parse(localStorage.getItem("posts") || "[]");
      const updatedPosts = storedPosts.filter((post: any) => post.id !== id);
      localStorage.setItem("posts", JSON.stringify(updatedPosts));
      
      // Update local state
      setPosts(posts.filter(post => post.id !== id));
    }
  };

  const filteredPosts = activeTab === "all" 
    ? posts 
    : posts.filter(post => post.status === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-10">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors group">
            <div className="bg-muted rounded-full p-1.5 mr-2 group-hover:bg-primary/10 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-card shadow-sm rounded-full px-4 py-2">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">
                {user?.user_metadata?.username || user?.email}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="flex items-center">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
            <Link to="/write">
              <Button className="font-medium bg-primary hover:bg-primary/90 shadow-glow transition-all duration-300 hover:shadow-md">
                <span className="mr-2">Create New Post</span>
                <span className="text-lg">+</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card border border-border/50 bg-card/95 backdrop-blur-sm hover:shadow-elegant transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{posts.length}</span>
                <div className="p-2 bg-primary/10 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border border-border/50 bg-card/95 backdrop-blur-sm hover:shadow-elegant transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{posts.filter(post => post.status === "published").length}</span>
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border border-border/50 bg-card/95 backdrop-blur-sm hover:shadow-elegant transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{posts.filter(post => post.status === "draft").length}</span>
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600 dark:text-yellow-400"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-elegant border border-border/50 bg-card/95 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardTitle className="font-heading text-2xl">Your Blog Posts</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="mb-6 p-1 bg-muted/50 backdrop-blur-sm">
                <TabsTrigger value="all" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">All Posts</TabsTrigger>
                <TabsTrigger value="published" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">Published</TabsTrigger>
                <TabsTrigger value="draft" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">Drafts</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {renderPostsTable(filteredPosts, handleDelete)}
              </TabsContent>
              
              <TabsContent value="published" className="space-y-4">
                {renderPostsTable(filteredPosts, handleDelete)}
              </TabsContent>
              
              <TabsContent value="draft" className="space-y-4">
                {renderPostsTable(filteredPosts, handleDelete)}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const renderPostsTable = (posts: BlogPost[], handleDelete: (id: string) => void) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="inline-flex flex-col items-center justify-center p-8 rounded-lg bg-muted/30 backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground mb-4">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <p className="text-muted-foreground text-lg">No posts found</p>
          <p className="text-muted-foreground text-sm mt-1">Create your first post to get started</p>
          <Link to="/write" className="mt-4">
            <Button variant="outline" className="mt-2 border-dashed hover:border-solid transition-all duration-300">
              <span className="mr-2">Create New Post</span>
              <span className="text-lg">+</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-card/80 backdrop-blur-sm">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent border-b border-border/70">
            <TableHead className="font-medium">Title</TableHead>
            <TableHead className="font-medium">Status</TableHead>
            <TableHead className="font-medium">Category</TableHead>
            <TableHead className="font-medium">Date</TableHead>
            <TableHead className="text-right font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id} className="hover:bg-muted/20 transition-colors duration-200 border-b border-border/30 last:border-0">
              <TableCell className="font-medium">
                <div className="flex items-center">
                  {post.featuredImage ? (
                    <img 
                      src={post.featuredImage} 
                      alt={post.title} 
                      className="w-10 h-10 object-cover rounded mr-3 border border-border/50" 
                    />
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded flex items-center justify-center mr-3 border border-border/50">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                        <circle cx="9" cy="9" r="2"></circle>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                      </svg>
                    </div>
                  )}
                  <span className="line-clamp-1">{post.title}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={post.status === "published" ? "default" : "secondary"}
                  className={`${post.status === "published" ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400"}`}
                >
                  {post.status === "published" ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell>
                {post.category ? (
                  <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary-foreground">
                    {post.category}
                  </span>
                ) : (
                  <span className="text-muted-foreground text-sm">—</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/30 mr-2"></div>
                  <span className="text-sm">{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-1">
                  <Link to={`/blog/${post.id}`}>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to={`/write?edit=${post.id}`}>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-secondary/10 hover:text-secondary transition-colors">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(post.id)}
                    className="rounded-full h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Dashboard;