export const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    console.warn("Cloudinary cloud name not set. Using local base64 fallback.");
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  // Fetch the signature from our secure backend API
  const signRes = await fetch("/api/cloudinary-sign", { method: "POST" });
  if (!signRes.ok) {
    throw new Error("Failed to get upload signature");
  }
  const { timestamp, signature, api_key } = await signRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", api_key);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);

  const resourceType = file.type === "application/pdf" ? "raw" : "auto";

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || "Failed to upload file");
  }

  const data = await res.json();
  return data.secure_url;
};
