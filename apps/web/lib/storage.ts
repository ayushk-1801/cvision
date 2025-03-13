import { join } from 'path';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads a file to the local file system storage
 * In a production environment, this would upload to cloud storage like S3
 * 
 * @param file The file to upload
 * @param path The path where the file should be stored
 * @returns The URL to the uploaded file
 */
export async function uploadFile(file: File, path: string): Promise<string> {
  try {
    // In production, this would be a call to a cloud storage service
    
    // For local development storage:
    // Convert the File to an ArrayBuffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Generate unique filename to prevent collisions
    const filename = `${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // Define storage directory (in public folder for easy access)
    const storageDir = join(process.cwd(), 'public', 'uploads');
    const fileDir = join(storageDir, path.split('/').slice(0, -1).join('/'));
    const filePath = join(fileDir, filename);
    const publicPath = `/uploads/${path.split('/').slice(0, -1).join('/')}/${filename}`;
    
    // Create directory if it doesn't exist
    if (!existsSync(fileDir)) {
      await mkdir(fileDir, { recursive: true });
    }
    
    // Write the file
    await writeFile(filePath, buffer);
    
    console.log(`File uploaded to: ${filePath}`);
    
    // Return the public URL to the file
    return publicPath;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
}

/**
 * Deletes a file from storage
 * 
 * @param url The URL of the file to delete
 */
export async function deleteFile(url: string): Promise<void> {
  try {
    // For cloud storage, we'd call the appropriate delete API
    
    // For local storage:
    const filePath = join(process.cwd(), 'public', url);
    
    // Check if file exists before attempting to delete
    if (existsSync(filePath)) {
      await unlink(filePath);
      console.log(`File deleted: ${filePath}`);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    // We don't throw here since file deletion failures are often non-critical
  }
}

/**
 * Generates a signed URL for temporary access to a file
 * For local development, just returns the public URL
 * 
 * @param path The path of the file
 * @param expiresInMinutes How long the signed URL should be valid for
 * @returns A signed URL for accessing the file
 */
export function getSignedUrl(path: string, expiresInMinutes = 15): string {
  // In production with cloud storage, we would generate a signed URL with expiration
  
  // For local development, just return the public path
  return path;
}
