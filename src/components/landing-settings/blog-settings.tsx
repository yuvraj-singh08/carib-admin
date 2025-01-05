import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlogs } from "@/redux/blogSlice"; // Import the thunk
import { AppDispatch, RootState } from "@/provider/redux-provider"; // Adjust based on your store structure
import { MdEdit, MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa6";

const BlogTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); // Use a typed dispatch hook

  // Access blogs state
  const { blogs, loading, error } = useSelector((state: RootState) => state.blogs);

  useEffect(() => {
    dispatch(getBlogs());
  }, [dispatch]);

  const handleEdit = (id: string) => {
    console.log(`Edit blog with id: ${id}`);
  };

  const handleView = (id: string) => {
    console.log(`View blog with id: ${id}`);
  };

  const handleDelete = (id: string) => {
    console.log(`Delete blog with id: ${id}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full bg-white rounded-xl p-10">
      <div className="flex justify-between mb-4">
        <h1 className="font-semibold text-xl text-blue">Blogs</h1>
        <button className="bg-blue text-white px-4 py-2 rounded">+ Blogs</button>
      </div>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">S.No</th>
            <th className="border border-gray-300 px-4 py-2">Image</th>
            <th className="border border-gray-300 px-4 py-2">Description</th>
            <th className="border border-gray-300 px-4 py-2">Secondary Description</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog, index) => (
            <tr key={blog.id} className="odd:bg-white even:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <img
                  src={blog.mainImg}
                  alt="Blog"
                  className="w-16 h-16 object-cover rounded-md mx-auto"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">{blog.description}</td>
              <td className="border border-gray-300 px-4 py-2">{blog.secondaryDesc}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button
                  onClick={() => handleEdit(blog.id)}
                  className="bg-green-500 text-white p-2 rounded mr-2 hover:bg-green-600"
                >
                  <MdEdit />
                </button>
                <button
                  onClick={() => handleView(blog.id)}
                  className="bg-yellow-500 text-white p-2 rounded mr-2 hover:bg-yellow-600"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                  <MdDelete />
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

