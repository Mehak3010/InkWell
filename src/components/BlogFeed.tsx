import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import BlogCard from "@/components/BlogCard";

const BlogFeed = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            const { data, error } = await supabase.from("posts").select("*");
            if (error) {
                console.error("Error fetching posts:", error.message);
            } else {
                setPosts(data || []);
            }
            setLoading(false);
        };
        fetchPosts();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (posts.length === 0) return <p>No posts yet.</p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
                <BlogCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    excerpt={post.excerpt}
                    author={{ name: post.author_name, avatar: post.author_avatar }}
                    category={post.category}
                    readTime={post.read_time}
                    publishedAt={post.published_at}
                    likes={post.likes || 0}
                    comments={post.comments || 0}
                    image={post.image}
                />
            ))}
        </div>
    );
};

export default BlogFeed;
