import axios from "axios";
import FormData from "form-data";

function timeoutAfter(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Upload timed out after ${ms / 1000} seconds`));
    }, ms);
  });
}

export default async function uploadImageToStrapi(imageUrl, STRAPI_URL, API_TOKEN) {
  const mainLogic = async () => {
    try {
      if (!imageUrl) return null;

      const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

      const contentType = response.headers["content-type"];
      let extension = ".jpg";
      if (contentType === "image/svg+xml") {
        extension = ".svg";
      } else if (contentType.startsWith("image/")) {
        extension = `.${contentType.split("/")[1]}`;
      }

      const formData = new FormData();
      formData.append("files", Buffer.from(response.data), `image${extension}`);

      const uploadResponse = await axios.post(`${STRAPI_URL}/api/upload`, formData, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          ...formData.getHeaders(),
        },
      });

      if (uploadResponse.data?.length > 0) {
        return uploadResponse.data[0].id;
      }

      throw new Error("Image upload failed: No data returned from Strapi.");
    } catch (error) {
      console.error("Error uploading image to Strapi:", error.response ? error.response.data : error);
      return null;
    }
  };

  try {
    return await Promise.race([mainLogic(), timeoutAfter(60000)]);
  } catch (error) {
    console.warn(`⏱️ Image upload aborted: ${error.message}`);
    return null;
  }
}