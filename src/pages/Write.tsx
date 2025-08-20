import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Eye, Upload, X } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

const Write = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const editId = searchParams.get("edit");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [publisherName, setPublisherName] = useState("");
  const [tags, setTags] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (editId) {
      // Load post data if editing an existing post
      const fetchPost = async () => {
        try {

          // Try to fetch from Supabase
          const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', editId)
            .single();
          
          if (error) throw error;
          
          if (data) {
            setTitle(data.title || "");
            setContent(data.content || "");
            setCategory(data.category || "");
            setPublisherName(data.publisherName || "");
            setTags(data.tags ? data.tags.join(", ") : "");
            setExcerpt(data.excerpt || "");
            setImagePreview(data.featuredImage || null);
          }
        } catch (error) {
          console.error("Error fetching post:", error);
          
          // Fallback to localStorage if Supabase fails
          const posts = JSON.parse(localStorage.getItem("posts") || "[]");
          const post = posts.find((p: any) => p.id.toString() === editId);
          
          if (post) {
            setTitle(post.title || "");
            setContent(post.content || "");
            setCategory(post.category || "");
            setPublisherName(post.publisherName || "");
            setTags(post.tags ? post.tags.join(", ") : "");
            setExcerpt(post.excerpt || "");
            setImagePreview(post.featuredImage || null);
          }
        }
      };
      
      fetchPost();
    }
    
    // Set publisher name to username or email if available
    if (!publisherName && user) {
      setPublisherName(user.user_metadata?.username || user.email || "Anonymous");
    }
  }, [editId, publisherName, user]);

  const handlePublish = () => {
    setIsPublishing(true);
    savePost("published");
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    savePost("draft");
  };

  const savePost = async (status: "published" | "draft") => {
    try {
      const postData = {
        id: editId || Date.now().toString(),
        title,
        content,
        category,
        publisherName,
        tags: tags.split(",").map((t) => t.trim()),
        excerpt,
        featuredImage: imagePreview,
        created_at: new Date().toISOString(),
        status,
        user_id: user?.id,
      };

      let result;
      
      if (editId) {
        // Update existing post
        result = await supabase
          .from('posts')
          .update(postData)
          .eq('id', editId);
      } else {
        // Add new post
        result = await supabase
          .from('posts')
          .insert([postData])
          .select();
      }

      if (result.error) throw result.error;

      setIsPublishing(false);
      setIsSaving(false);
      
      // Show success message and redirect to dashboard
      alert(`✅ Post ${status === "published" ? "published" : "saved as draft"} successfully!`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving post:", error);
      
      // Fallback to localStorage if Supabase fails
      const newPost = {
        id: editId || Date.now().toString(),
        title,
        content,
        category,
        publisherName,
        tags: tags.split(",").map((t) => t.trim()),
        excerpt,
        featuredImage: imagePreview,
        created_at: new Date().toISOString(),
        status,
      };

      const existingPosts = JSON.parse(localStorage.getItem("posts") || "[]");
      
      let updatedPosts;
      if (editId) {
        // Update existing post
        updatedPosts = existingPosts.map((post: any) => 
          post.id.toString() === editId ? newPost : post
        );
      } else {
        // Add new post
        updatedPosts = [newPost, ...existingPosts];
      }
      
      localStorage.setItem("posts", JSON.stringify(updatedPosts));

      setIsPublishing(false);
      setIsSaving(false);
      
      // Show success message and redirect to dashboard
      alert(`✅ Post ${status === "published" ? "published" : "saved as draft"} successfully! (Saved locally)`);
      navigate("/dashboard");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFeaturedImage(null);
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-10">
          <Link to="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>

          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleSaveDraft} className="font-medium" disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
            <Button variant="outline" onClick={() => setShowPreview(!showPreview)} className="font-medium">
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? "Edit" : "Preview"}
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isPublishing || !title || !content}
              className="font-medium"
            >
              {isPublishing ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>

        {showPreview ? (
          <Card className="shadow-elegant border-0">
            <CardHeader className="border-b bg-gradient-card">
              <CardTitle className="font-heading text-2xl">Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <article className="prose prose-lg max-w-none">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt={title || "Featured image"}
                    className="w-full h-80 object-cover rounded-xl mb-8 shadow-card"
                  />
                )}
                <h1 className="text-4xl font-bold mb-3 font-heading">{title || "Your Blog Title"}</h1>
                <div className="text-muted-foreground text-sm mb-6 flex items-center space-x-2">
                  <span>By {publisherName || "Author"}</span>
                  {category && (
                    <>
                      <span>•</span>
                      <span>in {category}</span>
                    </>
                  )}
                </div>
                {excerpt && (
                  <p className="text-lg text-muted-foreground mb-8 italic font-medium leading-relaxed border-l-4 border-primary/20 pl-6">{excerpt}</p>
                )}
                <div className="whitespace-pre-wrap leading-relaxed text-lg">
                  {content || "Your blog content will appear here..."}
                </div>
                {tags && (
                  <div className="mt-8 pt-6 border-t">
                    <div className="flex flex-wrap gap-2">
                      {tags.split(',').map((tag, index) => (
                        <span key={index} className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <Card className="shadow-elegant border-0">
                <CardHeader className="border-b bg-gradient-card">
                  <CardTitle className="font-heading text-2xl">Write Your Story</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="space-y-2">
                    <Label htmlFor="publisher" className="text-sm font-medium">
                      Publisher Name
                    </Label>
                    <Input
                      id="publisher"
                      placeholder="Your name or organization"
                      value={publisherName}
                      onChange={(e) => setPublisherName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                      Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter your blog title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Featured Image
                    </Label>
                    <div className="space-y-4">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-md border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={removeImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-6">
                          <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                            <div className="mt-4">
                              <Label htmlFor="image-upload" className="cursor-pointer">
                                <span className="text-sm font-medium text-primary hover:text-primary/80">
                                  Upload an image
                                </span>
                                <Input
                                  id="image-upload"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                />
                              </Label>
                              <p className="text-xs text-muted-foreground mt-1">
                                PNG, JPG, GIF up to 10MB
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt" className="text-sm font-medium">
                      Summary/Excerpt
                    </Label>
                    <Textarea
                      id="excerpt"
                      placeholder="Brief summary of your post (this will appear in previews)..."
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      className="h-20 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-sm font-medium">
                      Content
                    </Label>
                    <Textarea
                      id="content"
                      placeholder="Share your thoughts..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-96 resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="shadow-elegant border-0">
                <CardHeader className="border-b bg-gradient-card">
                  <CardTitle className="font-heading text-xl">Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Category
                    </label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="career">Career</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-sm font-medium">
                      Tags
                    </Label>
                    <Input
                      id="tags"
                      placeholder="Add tags (comma separated)"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-elegant border-0">
                <CardHeader className="border-b bg-gradient-card">
                  <CardTitle className="font-heading text-xl">Publishing Tips</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="text-sm text-muted-foreground space-y-3 leading-relaxed">
                    <li>• Write a compelling title</li>
                    <li>• Use clear headings to structure your content</li>
                    <li>• Add relevant tags to help readers find your post</li>
                    <li>• Include a brief excerpt for previews</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Write;