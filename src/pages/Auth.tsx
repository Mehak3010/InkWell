import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === "Email not confirmed") {
          setError("Your email is not confirmed. Please check your inbox for a confirmation link.");
        } else {
          throw error;
        }
      }
      
      if (data.user && data.session) {
        toast({
          title: "Success!",
          description: "You have successfully signed in.",
        });
        navigate("/dashboard");
      } else if (data.user && !data.session) {
        // This case might happen if the user signs in but their session isn't immediately available
        // or if email confirmation is pending.
        setError("Please check your email for a confirmation link to complete your sign-in.");
      }
    } catch (error: any) {
      setError(error.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (authError) throw authError;
      
      toast({
        title: "Account created!",
        description: "Your account has been successfully created. You can now sign in.",
      });
      
      // Switch to sign in tab
      const signinTab = document.querySelector('[data-state="inactive"][value="signin"]') as HTMLElement;
      if (signinTab) signinTab.click();
      
    } catch (error: any) {
      setError(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Blog-related background image with overlay */}
      <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: 'url(/images/blog-hero.jpg)', backgroundSize: 'cover' }}></div>
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-primary/50 to-black/70 z-0"></div>
      <div className="absolute inset-0 backdrop-blur-sm z-0"></div>
      
      {/* Content */}
      <div className="w-full max-w-lg z-10">


        <Card className="backdrop-blur-md bg-card/80 border-2 border-primary/20 shadow-elegant rounded-xl">
          {/* Logo Banner */}
          <div className="w-full bg-gradient-to-r from-primary/90 via-primary to-primary/90 p-8 flex flex-col items-center justify-center">
            <div className="bg-white rounded-full p-4 shadow-glow mb-5 border-2 border-white/50">
              <img 
                src="/images/43120cc5-a7a7-4485-a98a-9501631df39f.png" 
                alt="InkWell Logo" 
                className="h-12 w-12"
              />
            </div>
            <span className="text-3xl font-bold text-white">
              InkWell
            </span>
          </div>
          
          <CardHeader className="text-center pt-6">
            <CardTitle className="text-2xl text-white">Welcome</CardTitle>
            <CardDescription className="text-lg text-white">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 rounded-lg">
                <TabsTrigger value="signin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-3 text-white">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg py-3 text-white">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-white">{error}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="email-signup" className="text-sm font-medium flex items-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background/70 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all rounded-md shadow-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password-signup" className="text-sm font-medium flex items-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-background/70 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all rounded-md shadow-sm"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-primary/90 hover:bg-white shadow-glow hover:shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-md mt-4 py-4 text-base font-medium text-white hover:text-black" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-white">{error}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleSignUp} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium flex items-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Username
                    </label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-background/70 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all rounded-md shadow-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email-signup" className="text-sm font-medium flex items-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email
                    </label>
                    <Input
                      id="email-signup"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background/70 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all rounded-md shadow-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password-signup" className="text-sm font-medium flex items-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Password
                    </label>
                    <Input
                      id="password-signup"
                      type="password"
                      placeholder="Create a password (min. 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-background/70 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all rounded-md shadow-sm"
                      required
                      minLength={6}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-primary/90 hover:bg-white shadow-glow hover:shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-md mt-4 py-6 text-base font-medium text-white hover:text-black" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;