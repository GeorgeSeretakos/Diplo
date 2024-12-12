import axios from "axios";
import FormData from "form-data";

export default async function uploadImageToStrapi(imageUrl, STRAPI_URL, API_TOKEN) {
  try {
    if (!imageUrl) return null;

    // Fetch the image from the external URL
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

    // Extract the file type and determine the appropriate extension
    const contentType = response.headers["content-type"];
    let extension = ".jpg"; // Default extension
    if (contentType === "image/svg+xml") {
      extension = ".svg";
    } else if (contentType.startsWith("image/")) {
      extension = `.${contentType.split("/")[1]}`;
    }

    // Prepare the form data
    const formData = new FormData();
    formData.append("files", Buffer.from(response.data), `image${extension}`);

    // Upload the image
    const uploadResponse = await axios.post(`${STRAPI_URL}/api/upload`, formData, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        ...formData.getHeaders(),
      },
    });

    // Validate the response
    if (uploadResponse.data?.length > 0) {
      // console.log("Uploaded image to Strapi:", uploadResponse.data[0]);
      return uploadResponse.data[0].id; // Return the image ID
    }

    throw new Error("Image upload failed: No data returned from Strapi.");
  } catch (error) {
    console.error("Error uploading image to Strapi:", error.response ? error.response.data : error);
    return null;
  }
}
