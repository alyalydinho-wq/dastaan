import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const newImages = [...images];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Convert file to base64 string for permanent storage in database
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
        
        newImages.push(base64);
      }

      onChange(newImages);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Erreur lors du téléchargement des images.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img, index) => (
          <div key={index} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 group border border-slate-200">
            <img 
              src={img} 
              alt={`Upload ${index + 1}`} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-red-500 hover:text-white text-slate-700 rounded-full flex items-center justify-center transition-colors shadow-sm opacity-0 group-hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
            {index === 0 && (
              <div className="absolute bottom-2 left-2 bg-tbm-blue text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                Principale
              </div>
            )}
          </div>
        ))}

        {/* Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="relative aspect-[4/3] rounded-xl border-2 border-dashed border-slate-300 hover:border-tbm-blue hover:bg-blue-50 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-tbm-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm font-medium">Envoi...</span>
            </>
          ) : (
            <>
              <Upload className="w-6 h-6" />
              <span className="text-sm font-medium">Ajouter</span>
            </>
          )}
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/webp"
        multiple
        className="hidden"
      />
      
      <p className="text-sm text-slate-500">
        Formats acceptés : JPG, PNG, WEBP. La première image sera utilisée comme miniature principale.
      </p>
    </div>
  );
}
