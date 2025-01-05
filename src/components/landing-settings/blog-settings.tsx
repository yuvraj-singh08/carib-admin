import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { getBlogs } from "@/redux/blogSlice"; // Import the thunk
import { AppDispatch, RootState } from "@/provider/redux-provider"; // Adjust based on your store structure
import { MdEdit, MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

// Utility function to strip HTML tags
const stripHtmlTags = (html: string): string => {
  const tempElement = document.createElement("div");
  tempElement.innerHTML = html;
  return tempElement.textContent || tempElement.innerText || "";
};

const BlogTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [deletePopup, setDeletePopup] = useState<null | string>(null); // To track the blog to be deleted
  const popupRef = useRef<HTMLDivElement | null>(null);

  const { blogs, loading, error } = useSelector((state: RootState) => state.blogs);

  useEffect(() => {
    dispatch(getBlogs());
  }, [dispatch]);

  const handleEdit = (id: string) => {
    navigate(`/edit-blog/${id}`);
  };

  const handleView = (id: string) => {
    console.log(`View blog with id: ${id}`);
  };

  const confirmDelete = async (id: string) => {
    try {
      await axios.post("https://travelcarib.tekniche.xyz/admin/delete-blog", { id });
      toast.success("Blog deleted successfully!");
      dispatch(getBlogs());
    } catch (error) {
      toast.error("Failed to delete blog. Please try again.");
    } finally {
      setDeletePopup(null); // Close the popup after deletion
    }
  };

  const handleAddBlog = () => {
    navigate("/add-blog");
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
      setDeletePopup(null); // Close the popup when clicking outside
    }
  };

  useEffect(() => {
    if (deletePopup) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [deletePopup]);

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
        <button onClick={handleAddBlog} className="bg-blue text-white px-4 py-2 rounded">
          + Blogs
        </button>
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
              <td className="border border-gray-300 px-4 py-2">
                {stripHtmlTags(blog.description)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {stripHtmlTags(blog.secondaryDesc)}
              </td>
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
                  onClick={() => setDeletePopup(blog.id)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                >
                  <MdDelete />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete confirmation popup */}
      {deletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div ref={popupRef} className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this blog?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setDeletePopup(null)}
                className="px-4 py-2 bg-gray-300 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deletePopup)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogTable;
