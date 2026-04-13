import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload une image vers Cloudinary dans un dossier spécifique au véhicule
 */
export const uploadVehicleImage = async (fileStr: string, vehicleId: string) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: `tbm-auto/vehicles/${vehicleId}`,
      transformation: [
        { width: 1200, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'webp' },
      ],
    });
    return uploadResponse;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Erreur lors de l\'upload vers Cloudinary');
  }
};

/**
 * Supprime une image de Cloudinary via son publicId
 */
export const deleteVehicleImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Erreur lors de la suppression sur Cloudinary');
  }
};

export default cloudinary;
