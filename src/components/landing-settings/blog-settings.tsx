import React from "react";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa6";
import { Link } from "react-router-dom";

interface Blog {
  id: number;
  image: string;
  title: string;
  date: string;
}

const BlogTable: React.FC = () => {
  const blogs: Blog[] = [
    {
      id: 1,
      image: "https://pixlr.com/images/generator/image-editor.webp",
      title: "First Blog",
      date: "2024-12-13",
    },
    {
      id: 2,
      image: "https://pixlr.com/images/generator/image-editor.webp",
      title: "Second Blog",
      date: "2024-12-12",
    },
    // Add more blog data here...
  ];

  const handleEdit = (id: number) => {
    console.log(`Edit blog with id: ${id}`);
  };

  const handleView = (id: number) => {
    console.log(`View blog with id: ${id}`);
  };

  const handleDelete = (id: number) => {
    console.log(`Delete blog with id: ${id}`);
  };

  return (
    <div className="w-full bg-white rounded-xl p-10">
      <div className="flex justify-end mb-4">
        <Link to="/add-blog" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          + Blogs
        </Link>
      </div>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">S.No</th>
            <th className="border border-gray-300 px-4 py-2">Image</th>
            <th className="border border-gray-300 px-4 py-2">Title</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog, index) => (
            <tr key={blog.id} className="odd:bg-white even:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 text-center text-sm">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <img src={blog.image} alt={blog.title} className="w-16 h-16 object-cover rounded-md mx-auto" />
              </td>
              <td className="border border-gray-300 px-4 py-2 text-sm text-center">{blog.title}</td>
              <td className="border border-gray-300 px-4 py-2 text-sm text-center">{blog.date}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button
                  onClick={() => handleEdit(blog.id)}
                  className="bg-blue-500 text-white bg-green-500 hover:bg-green-600 p-2 rounded mr-2 hover:bg-blue-600"
                >
                  <MdEdit/>
                </button>
                <button
                  onClick={() => handleView(blog.id)}
                  className="bg-gray-500 text-white bg-yellow-500 hover:bg-yellow-600 p-2 rounded mr-2 hover:bg-gray-600"
                >
                  <FaEye/>
                </button>
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                  <MdDelete/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlogTable;
