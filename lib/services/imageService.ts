// Image service abstraction layer
// Current: base64 encoding
// Future: Easy to migrate to cloud storage (Cloudinary, AWS S3, etc.)

export interface ImageUploadResult {
  url: string;
  thumbnailUrl?: string;
  success: boolean;
  error?: string;
}

export interface ImageServiceInterface {
  uploadImage(file: File): Promise<ImageUploadResult>;
  deleteImage(url: string): Promise<boolean>;
  getImageUrl(identifier: string): string;
}

// Base64 Implementation (Current - for testing)
class Base64ImageService implements ImageServiceInterface {
  private readonly MAX_SIZE_MB = 2;
  private readonly MAX_SIZE_BYTES = this.MAX_SIZE_MB * 1024 * 1024;

  async uploadImage(file: File): Promise<ImageUploadResult> {
    try {
      // Validate file size
      if (file.size > this.MAX_SIZE_BYTES) {
        return {
          url: '',
          success: false,
          error: `File too large. Max size is ${this.MAX_SIZE_MB}MB`,
        };
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        return {
          url: '',
          success: false,
          error: 'File must be an image',
        };
      }

      // Convert to base64
      const base64 = await this.fileToBase64(file);

      return {
        url: base64,
        success: true,
      };
    } catch (error) {
      return {
        url: '',
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  async deleteImage(url: string): Promise<boolean> {
    // For base64, we don't need to delete anything
    // When migrating to cloud storage, implement actual deletion
    return true;
  }

  getImageUrl(identifier: string): string {
    // For base64, the identifier IS the URL
    // When migrating to cloud storage, this would construct the CDN URL
    return identifier;
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }
}

// Cloud Storage Implementation (Future - placeholder)
// Uncomment and implement when ready to migrate
/*
class CloudImageService implements ImageServiceInterface {
  private cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  private uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  async uploadImage(file: File): Promise<ImageUploadResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset!);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudinaryCloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      return {
        url: data.secure_url,
        thumbnailUrl: data.thumbnail_url,
        success: true,
      };
    } catch (error) {
      return {
        url: '',
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  async deleteImage(url: string): Promise<boolean> {
    // Implement cloud deletion logic
    return true;
  }

  getImageUrl(identifier: string): string {
    // Return CDN URL
    return identifier;
  }
}
*/

// Export singleton instance
// To migrate: change `new Base64ImageService()` to `new CloudImageService()`
export const imageService: ImageServiceInterface = new Base64ImageService();
