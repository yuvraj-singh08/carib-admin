import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { getBlogs } from "@/redux/blogSlice";
import { AppDispatch, RootState } from "@/provider/redux-provider";
import { MdEdit, MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const BlogTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [deletePopup, setDeletePopup] = useState<null | string>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const { blogs } = useSelector((state: RootState) => state.blogs);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getBlogs());
  }, [dispatch]);

  const handleEdit = (id: string) => {
    navigate(`/edit-blog/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/blog/${id}`);
  };


  const confirmDelete = async (id: string) => {
    try {
      await axios.post("https://travelcarib.tekniche.xyz/admin/delete-blog", { id });
      toast.success("Blog deleted successfully!");
      dispatch(getBlogs());
    } catch (error) {
      toast.error("Failed to delete blog. Please try again.");
    } finally {
      setDeletePopup(null);
    }
  };

  const handleAddBlog = () => {
    navigate("/add-blog");
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
      setDeletePopup(null);
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

  const totalPages = Math.ceil(blogs.length / rowsPerPage);

  const paginatedBlogs = blogs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  const truncateWords = (text: string, wordLimit: number): string => {
    const words = text.split(" ");
    return words.slice(0, wordLimit).join(" ") + (words.length > wordLimit ? "..." : "");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
          {paginatedBlogs.map((blog, index) => (
            <tr key={blog.id} className="odd:bg-white even:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 text-center">
                {(currentPage - 1) * rowsPerPage + index + 1}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <img
                  src={blog.mainImg}
                  alt="Blog"
                  className="w-16 h-16 object-cover rounded-md mx-auto"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <p
                  className="text-[0.85rem] font-medium text-[#667085]"
                  dangerouslySetInnerHTML={{
                    __html: truncateWords(blog.description, 10),
                  }}
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <p
                  className="text-[0.85rem] font-medium text-[#667085]"
                  dangerouslySetInnerHTML={{
                    __html: truncateWords(blog.secondaryDesc || "", 15),
                  }}
                />
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

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <select
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          className="border border-gray px-2 py-1 rounded"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
        <div className="flex items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 border cursor-pointer text-gray ${currentPage === 1 ? "text-gray-400" : "text-blue"}`}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-4 py-2 border ${
                currentPage === i + 1 ? "bg-blue text-white" : "text-blue"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border cursor-pointer ${
              currentPage === totalPages ? "text-gray-400" : "text-blue"
            }`}
          >
            Next
          </button>
        </div>
      </div>

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
