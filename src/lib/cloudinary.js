export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
  formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME)

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    throw error
  }
}

export const getCloudinaryUrl = (publicId, transformations = "") => {
  return `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}${publicId}`
}
