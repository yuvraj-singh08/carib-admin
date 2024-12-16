import { useState } from "react";
import { Editor } from "primereact/editor";

const AddBlogPage = () => {
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainDescription, setMainDescription] = useState("");
  const [secondaryImages, setSecondaryImages] = useState<File[]>([]);
  const [secondaryDescription, setSecondaryDescription] = useState("");

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

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log({ mainImage, mainDescription, secondaryImages, secondaryDescription });
  };

  return (
    <div className="p-6 m-4">
      <h1 className="text-2xl font-bold mb-6">Add Blog</h1>

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
        className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        Save
      </button>
    </div>
  );
};

export default AddBlogPage;
