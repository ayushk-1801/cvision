import { NextRequest } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const filePath = path.join(process.cwd(), 'uploads', ...(await params).path);
  
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return new Response('File not found', { status: 404 });
    }
    
    // Read file
    const fileContent = fs.readFileSync(filePath);
    
    // Determine content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.doc':
        contentType = 'application/msword';
        break;
      case '.docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      // Add more content types as needed
    }
    
    // Return file
    return new Response(fileContent, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
    
  } catch (error) {
    console.error('Error serving static file:', error);
    return new Response('Error serving file', { status: 500 });
  }
}
