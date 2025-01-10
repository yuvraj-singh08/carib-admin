import React from "react";

interface BlogContentProps {
  blog: {
    mainImg: string;
    description: string;
    secondaryImg: string[];
    secondaryDesc: string;
    createdAt: string;
  };
}

const BlogContent: React.FC<BlogContentProps> = ({ blog }) => {
  // Format the creation date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      {/* Featured Image */}
      <div className="relative flex justify-center">
        <img
          src={blog.mainImg}
          alt="Blog Featured"
          className=" h-auto rounded-lg"
        />
        <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md px-4 py-2 rounded-md shadow-md">
          <p className="text-xs text-gray-600">{formatDate(blog.createdAt)}</p>
        </div>
      </div>

      {/* Blog Body */}
      <article className="mt-8">
        <div
          className="text-gray-700 leading-relaxed font-semibold  text-lg"
          dangerouslySetInnerHTML={{ __html: blog.description }}
        />
      </article>

      
      

      {/* Secondary Description */}
      <article className="mt-8">
        <div
          className="text-base text-gray-600 text-justify"
          dangerouslySetInnerHTML={{ __html: blog.secondaryDesc }}
        />
      </article>
<div className=" grid grid-cols-3 mt-4">
      {blog.secondaryImg.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Secondary Image ${index + 1}`}
            className="rounded-md object-cover w-fit"
          />
        ))}
        </div>
    </div>
  );
};

export default BlogContent;
