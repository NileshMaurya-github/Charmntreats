import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Image as ImageIcon, Link } from 'lucide-react';
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
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Convert file to base64 data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onImageChange(result);
        setNewImageUrl(result);
        toast({
          title: "Image Uploaded",
          description: "Hero image has been uploaded successfully.",
        });
      }
    };
    reader.readAsDataURL(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      {/* Upload method selection */}
      <div className="flex gap-2 mb-4">
        <Button
          type="button"
          variant={uploadMethod === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMethod('url')}
          className="flex items-center"
        >
          <Link className="h-4 w-4 mr-2" />
          URL
        </Button>
        <Button
          type="button"
          variant={uploadMethod === 'file' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMethod('file')}
          className="flex items-center"
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Upload File
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
      
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

      {/* URL input method */}
      {uploadMethod === 'url' && (
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
            Update URL
          </Button>
        </div>
      )}

      {/* File upload method */}
      {uploadMethod === 'file' && (
        <div className="space-y-2">
          <Button
            type="button"
            onClick={triggerFileUpload}
            className="bg-green-600 hover:bg-green-700 w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Choose Image File
          </Button>
          <p className="text-sm text-gray-500">
            Supported formats: JPG, PNG, GIF, WebP (Max 5MB)
          </p>
        </div>
      )}

      {!imageUrl && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No hero image set</p>
          <p className="text-sm text-gray-400">Use URL or upload a file above</p>
        </div>
      )}

      <p className="text-sm text-gray-500">
        Recommended size: 1200x600px or larger for best quality
      </p>
    </div>
  );
};

export default HomepageImageUpload;