import React, { useState } from "react";
import { postBlog, resetState } from "@/redux/blogSlice";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Editor } from "primereact/editor";
import { AppDispatch, RootState } from "@/provider/redux-provider";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

const AddBlogPage = () => {
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainDescription, setMainDescription] = useState("");
  const [secondaryImages, setSecondaryImages] = useState<File[]>([]);
  const [secondaryDescription, setSecondaryDescription] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, success, error } = useSelector((state: RootState) => state.blogs);

  const handleMainImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setMainImage(event.target.files[0]);
    }
  };

  const handleSecondaryImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      if (secondaryImages.length + filesArray.length <= 3) {
        setSecondaryImages([...secondaryImages, ...filesArray]);
      } else {
        alert("You can only upload up to 3 images.");
      }
    }
  };

  const removeSecondaryImage = (index: number) => {
    setSecondaryImages(secondaryImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!mainImage || !mainDescription || !secondaryDescription) {
      toast.error("Please fill all required fields!");
      return;
    }
  
    try {
      const blogPayload = {
        mainImg: mainImage, // Pass File here
        description: mainDescription,
        secondaryImg: secondaryImages, // Pass array of Files here
        secondaryDesc: secondaryDescription,
      };
  
      dispatch(postBlog(blogPayload));
    } catch (uploadError) {
      toast.error("Image upload failed. Please try again.");
    }
  };

  React.useEffect(() => {
    if (success) {
      toast.success("Blog posted successfully!");
      navigate("/landing-settings");
      dispatch(resetState());
    }
    if (error) {
      toast.error(`Error: ${error}`);
    }
  }, [success, error, dispatch, navigate]);

  return (
    <div className="p-6 m-4">
      {/* Back Button */}
      <div className="flex justify-between">
        <h1 className="text-2xl text-blue font-bold mb-6">Add Blog</h1>

        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to List
        </Button>
      </div>

      {/* Main Image */}
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
          onChange={handleMainImageChange}
          className="hidden"
        />
        {mainImage && (
          <img
            src={URL.createObjectURL(mainImage)}
            alt="Main Preview"
            className="mt-4 w-32 h-32 object-cover border rounded-md"
          />
        )}
      </div>

      {/* Main Description */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Main Description</label>
        <Editor
          value={mainDescription}
          onTextChange={(e) => setMainDescription(e.htmlValue || "")}
          style={{ height: "200px" }}
        />
      </div>

      {/* Secondary Images */}
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
          onChange={handleSecondaryImagesChange}
          className="hidden"
        />
        <div className="mt-4 flex gap-4 flex-wrap">
          {secondaryImages.map((image, index) => (
            <div key={index} className="relative w-32 h-32 border rounded-md overflow-hidden">
              <img
                src={URL.createObjectURL(image)}
                alt={`Secondary Preview ${index + 1}`}
                className="object-cover w-full h-full"
              />
              <button
                onClick={() => removeSecondaryImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary Description */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Description</label>
        <Editor
          value={secondaryDescription}
          onTextChange={(e) => setSecondaryDescription(e.htmlValue || "")}
          style={{ height: "200px" }}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-blue text-white rounded-md"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
};

export default AddBlogPage;
