import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "primereact/editor";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";

const EditBlogPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [mainImage, setMainImage] = useState<string>("");
  const [mainDescription, setMainDescription] = useState<string>("");  // Ensure it's a string
  const [secondaryImages, setSecondaryImages] = useState<string[]>([]);
  const [secondaryDescription, setSecondaryDescription] = useState<string>("");

  useEffect(() => {
    // Fetch blog data
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `https://travelcarib.tekniche.xyz/admin/blog/${id}`
        );
        const { mainImg, description, secondaryImg, secondaryDesc } = response.data;

        // Ensure the descriptions are set as strings
        setMainImage(mainImg || ""); // Fallback to empty string if undefined
        setMainDescription(description || ""); // Set the description safely
        setSecondaryImages(secondaryImg || []); // Ensure secondary images is an array
        setSecondaryDescription(secondaryDesc || ""); // Fallback to empty string
        console.log(mainDescription);
      } catch (error) {
        toast.error("Failed to fetch blog details.");
      }
    };

    if (id) fetchBlog();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const payload = {
        id,
        mainImg: mainImage,
        description: mainDescription,
        secondaryImg: secondaryImages,
        secondaryDesc: secondaryDescription,
      };

      await axios.post("https://travelcarib.tekniche.xyz/admin/update-blog", payload);
      toast.success("Blog updated successfully!");
      navigate("/landing-settings");
    } catch (error) {
      toast.error("Failed to update blog.");
    }
  };

  return (
    <div className="p-6 m-4">
      <div className="flex justify-between">
        <h1 className="text-2xl text-blue font-bold mb-6">Edit Blog</h1>
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to List
        </Button>
      </div>

      <div className="mb-6">
        <label
          htmlFor="mainImage"
          className="block text-sm font-medium border p-3 rounded-lg text-gray-700 mb-2 cursor-pointer hover:text-blue-600"
        >
          Upload Main Image
        </label>
        <input
          id="mainImage"
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const fileUrl = URL.createObjectURL(e.target.files[0]);
              setMainImage(fileUrl);
            }
          }}
          className="hidden"
        />
        {mainImage && (
          <img
            src={mainImage}
            alt="Main Preview"
            className="mt-4 w-32 h-32 object-cover border rounded-md"
          />
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Main Description</label>
        <Editor
          value={mainDescription}  // Bind the state to the editor
          onTextChange={(e) => setMainDescription(e.htmlValue || "")}  // Update the state on text change
          style={{ height: "200px" }}
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="secondaryImages"
          className="block text-sm font-medium border p-3 rounded-lg text-gray-700 mb-2 cursor-pointer hover:text-blue-600"
        >
          Upload Secondary Images (Max 3)
        </label>
        <input
          id="secondaryImages"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              const filesArray = Array.from(e.target.files).map((file) =>
                URL.createObjectURL(file)
              );
              setSecondaryImages(filesArray);
            }
          }}
          className="hidden"
        />
        <div className="mt-4 flex gap-2">
          {secondaryImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Secondary ${idx}`}
              className="w-20 h-20 object-cover border rounded-md"
            />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Secondary Description
        </label>
        <Editor
          value={secondaryDescription}  // Bind the state to the editor
          onTextChange={(e) => setSecondaryDescription(e.htmlValue || "")}  // Update the state on text change
          style={{ height: "200px" }}
        />
      </div>

      <button
        onClick={handleUpdate}
        className="bg-blue text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Update Blog
      </button>
    </div>
  );
};

export default EditBlogPage;
