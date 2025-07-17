import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Upload, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  images, 
  onImagesChange, 
  maxImages = 5 
}) => {
  const [newImageUrl, setNewImageUrl] = useState('');
  const { toast } = useToast();

  const addImageUrl = () => {
    if (!newImageUrl.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL.",
        variant: "destructive",
      });
      return;
    }

    if (images.length >= maxImages) {
      toast({
        title: "Maximum Images Reached",
        description: `You can only add up to ${maxImages} images.`,
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(newImageUrl);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL.",
        variant: "destructive",
      });
      return;
    }

    onImagesChange([...images, newImageUrl]);
    setNewImageUrl('');
    toast({
      title: "Image Added",
      description: "Image URL has been added successfully.",
    });
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
    toast({
      title: "Image Removed",
      description: "Image has been removed successfully.",
    });
  };

  return (
    <div className="space-y-4">
      <Label>Product Images (Max {maxImages})</Label>
      
      {/* Add new image URL */}
      <div className="flex gap-2">
        <Input
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          placeholder="Enter image URL (https://...)"
          className="flex-1"
        />
        <Button
          type="button"
          onClick={addImageUrl}
          disabled={images.length >= maxImages}
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      {/* Display current images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square overflow-hidden rounded-lg border">
                <img
                  src={imageUrl}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80';
                  }}
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No images added yet</p>
          <p className="text-sm text-gray-400">Add image URLs using the input above</p>
        </div>
      )}

      <p className="text-sm text-gray-500">
        {images.length}/{maxImages} images added
      </p>
    </div>
  );
};

export default ImageUpload;