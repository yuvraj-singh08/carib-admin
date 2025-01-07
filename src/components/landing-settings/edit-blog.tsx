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
  const [mainDescription, setMainDescription] = useState<string>("");
  const [secondaryImages, setSecondaryImages] = useState<string[]>([]);
  const [secondaryDescription, setSecondaryDescription] = useState<string>("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `https://travelcarib.tekniche.xyz/admin/blog/${id}`
        );
        const { mainImg, description, secondaryImg, secondaryDesc } = response.data;

        setMainImage(mainImg || ""); // Set main image URL
        setMainDescription(description || "");
        setSecondaryImages(secondaryImg || []); // Set secondary images as URLs
        setSecondaryDescription(secondaryDesc || "");
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

  const handleMainImageUpload = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    setMainImage(fileUrl);

    // Cleanup the object URL after use
    return () => URL.revokeObjectURL(fileUrl);
  };

  const handleSecondaryImageUpload = (file: File, index: number) => {
    const fileUrl = URL.createObjectURL(file);

    setSecondaryImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages[index] = fileUrl; // Replace the specific image
      return updatedImages;
    });

    // Cleanup the object URL after use
    return () => URL.revokeObjectURL(fileUrl);
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
              handleMainImageUpload(e.target.files[0]);
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
          value={mainDescription}
          onTextChange={(e) => setMainDescription(e.htmlValue || "")}
          style={{ height: "200px" }}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Secondary Images (Max 3)
        </label>
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="relative">
              <label
                htmlFor={`secondaryImage-${index}`}
                className="block text-sm font-medium text-gray-700 cursor-pointer"
              >
                {secondaryImages[index] ? (
                  <img
                    src={secondaryImages[index]}
                    alt={`Secondary ${index + 1}`}
                    className="w-32 h-32 object-cover border rounded-md"
                  />
                ) : (
                  <div className="w-32 h-32 border rounded-md flex items-center justify-center text-gray-500">
                    Upload
                  </div>
                )}
              </label>
              <input
                id={`secondaryImage-${index}`}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleSecondaryImageUpload(e.target.files[0], index);
                  }
                }}
                className="hidden"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Secondary Description
        </label>
        <Editor
          value={secondaryDescription}
          onTextChange={(e) => setSecondaryDescription(e.htmlValue || "")}
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
