import axios from "axios";

// Fetches a protected file and returns a blob URL
export const fetchSecureFile = async (filePath, token) => {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? "http://localhost:4000" : "https://api.tadbeerresource.com");
    const url = `${BASE_URL}${filePath}`;
    console.log("Fetching secure file:", { base: BASE_URL, filePath, url });

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
      withCredentials: true,
    });

    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error("Error fetching secure file:", error);
    return null;
  }
};


export const openProtectedFile = async (filePath, token) => {
  try {
    if (!token) {
      alert("User not authenticated — token missing.");
      return;
    }

    // Handle different file path formats
    let folder, filename;

    if (filePath.startsWith('/files/')) {
      // Format: /files/businessGrants/filename.pdf
      const pathParts = filePath.split('/');
      folder = pathParts[2]; // 'businessGrants', 'scholarships', etc
      filename = pathParts[3]; // actual filename
    } else if (filePath.startsWith('/uploads/')) {
      // Format: /uploads/others/proposal-1761054574534-446328647.pdf
      const pathParts = filePath.split('/');
      folder = pathParts[pathParts.length - 2];
      filename = pathParts[pathParts.length - 1];
    } else {
      // Fallback: assume it's just the filename
      folder = 'others';
      filename = filePath;
    }

    // Use the authenticated API route: /api/files/:folder/:filename
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? "http://localhost:4000" : "https://api.tadbeerresource.com");
    const url = `${BASE_URL}/api/files/${folder}/${filename}`;
    console.log("🔹 Fetching protected file from:", url);
    console.log("🔹 Original filePath:", filePath);
    console.log("🔹 Folder:", folder, "Filename:", filename);
    console.log("🔹 Token:", token ? "Present" : "Missing");

    // Fetch with token
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
      withCredentials: true,
    });

    console.log("🔹 Response status:", response.status);
    console.log("🔹 Response headers:", response.headers);

    const blob = new Blob([response.data], {
      type: response.headers["content-type"] || "application/octet-stream",
    });

    console.log("🔹 Blob size:", blob.size);
    console.log("🔹 Blob type:", blob.type);

    const blobUrl = window.URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 5000);
  } catch (error) {
    console.error("❌ Error opening protected file:", error);
    console.error("❌ Error details:", error.response?.data || error.message);
    console.error("❌ Error status:", error.response?.status);
    alert("Failed to open file. Please check your token or file path.");
  }
};
