import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HomepageImageUploadProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  label?: string;
}

const HomepageImageUpload: React.FC<HomepageImageUploadProps> = ({ 
  imageUrl, 
  onImageChange, 
  label = "Hero Image" 
}) => {
  const [newImageUrl, setNewImageUrl] = useState(imageUrl);
  const { toast } = useToast();

  const handleUpdateImage = () => {
    if (!newImageUrl.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL.",
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

    onImageChange(newImageUrl);
    toast({
      title: "Image Updated",
      description: "Hero image has been updated successfully.",
    });
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      {/* Current image preview */}
      {imageUrl && (
        <div className="relative w-full h-48 overflow-hidden rounded-lg border">
          <img
            src={imageUrl}
            alt="Hero image preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
            }}
          />
        </div>
      )}

      {/* Image URL input */}
      <div className="flex gap-2">
        <Input
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          placeholder="Enter image URL (https://...)"
          className="flex-1"
        />
        <Button
          type="button"
          onClick={handleUpdateImage}
          className="bg-amber-600 hover:bg-amber-700"
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Update
        </Button>
      </div>

      {!imageUrl && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No hero image set</p>
          <p className="text-sm text-gray-400">Add an image URL using the input above</p>
        </div>
      )}

      <p className="text-sm text-gray-500">
        Recommended size: 1200x600px or larger for best quality
      </p>
    </div>
  );
};

export default HomepageImageUpload;