import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlogContent from "./blog-content";
// import Sidebar from "./sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { axiosInstance } from "@/provider/axios";

// Define the Blog type
interface Blog {
  id: string;
  mainImg: string;
  description: string;
  secondaryImg: string[];
  secondaryDesc: string;
  createdAt: string;
  updatedAt: string;
}

const BlogPage = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<Blog>(
          `https://travelcarib.tekniche.xyz/admin/blog/${id}`
        );
        setBlog(response.data);
        console.log(blog);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to fetch the blog. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  if (loading) {
    return <p className="text-center text-lg">Loading blog...</p>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-600">{error}</p>;
  }

  if (!blog) {
    return <p className="text-center text-lg text-red-600">Blog not found.</p>;
  }

  return (
    <div className="max-w-screen-xl  mx-auto px-8 py-8 lg:py-12 gap-8">
      {/* Left Section */}
      <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to List
        </Button>
      <div className="lg:col-span-2 mt-16">
        {/* Blog Content */}
        <BlogContent blog={blog} />
      </div>

      {/* Right Sidebar */}
      {/* <aside>
        <Sidebar blog={blog} />
      </aside> */}

      
    </div>
  );
};

export default BlogPage;
