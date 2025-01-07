import axios from "axios";

export const uploadImage = async (img: File) => {
  let imgUrl: string = "";

  await axios
    .get(import.meta.env.VITE_BACKEND_URL + "/bucket/get-url")
    .then(async ({ data: { uploadURL } }) => {
      await axios({
        method: "PUT",
        url: uploadURL,
        headers: { "Content-Type": "multipart/form-data" },
        data: img,
      }).then(() => {
        imgUrl = uploadURL.split("?")[0];
      });
    });

  return imgUrl;
};