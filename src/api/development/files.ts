// project-imports
import { h } from '@fullcalendar/core/preact';
import { FileRecord } from 'types/development/files';



interface ApiResponse {
  code: number;
  msg: string;
  pageInfo: {
    page: number;
    pageSize: number;
    totalCount: number;
  };
  data: FileRecord[];
}

interface PaginatedResponse {
  data: FileRecord[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export async function getPlatformFiles(
  page: number, 
  pageSize: number, 
  filter: any
): Promise<PaginatedResponse> {
  try {
    const response = await fetch('/bvcsp/v1/recordfile/filter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('serviceToken') || ''
      },
      body: JSON.stringify({
        page: page,
        pageSize: pageSize,
        filter: filter
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse: ApiResponse = await response.json();
    
    if (apiResponse.code !== 0) {
      throw new Error(`API error: ${apiResponse.msg}`);
    }

    return {
      data: apiResponse.data,
      totalCount: apiResponse.pageInfo.totalCount,
      page: apiResponse.pageInfo.page,
      pageSize: apiResponse.pageInfo.pageSize
    };
  } catch (error) {
    console.error('Error fetching platform files:', error);
    throw error; // Re-throw to let the caller handle it
  }
}

export async function getTerminalFiles(
  deviceID: string,
  page: number, 
  pageSize: number, 
  filter: any
): Promise<PaginatedResponse> {
  try {
    const response = await fetch(`/bvcsp/v1/pu/recordfile/filter/${deviceID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('serviceToken') || ''
      },
      body: JSON.stringify({
        page: page,
        pageSize: pageSize,
        filter: filter
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse: ApiResponse = await response.json();

    if (apiResponse.code === 5) {
      // Device not online - show alert to user
      alert('Device is not online. Please check the device status and try again.');
      throw new Error('Device not online');
    }

    if (apiResponse.code !== 0) {
      throw new Error(`API error: ${apiResponse.msg}`);
    }

    return {
      data: apiResponse.data,
      totalCount: apiResponse.pageInfo.totalCount,
      page: apiResponse.pageInfo.page,
      pageSize: apiResponse.pageInfo.pageSize
    };
  } catch (error) {
    console.error('Error fetching platform files:', error);
    throw error; // Re-throw to let the caller handle it
  }
}

export async function perviewPlatformFiles(fileID: string): Promise<Blob> {
  try {
    const response = await fetch(`/bvnru/v1/download/mini/${fileID}?token=${localStorage.getItem('serviceToken') || ''}`, {
      method: 'GET',
      headers: {
        'Authorization': localStorage.getItem('serviceToken') || ''
      },
    }
  );
if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.blob();
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function perviewTerminalFiles(
  deviceID: string, 
  fileID: string, 
  onProgress?: (progress: number) => void
): Promise<Blob> {
  try {
    const response = await fetch(`/bvcsp/v1/pu/download/${deviceID}/${fileID}?token=${localStorage.getItem('serviceToken') || ''}`, {
      method: 'GET',
      // Remove Range header for initial request to get file size
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if server supports range requests
    const acceptRanges = response.headers.get('accept-ranges');
    const contentLength = response.headers.get('content-length');
    const totalSize = parseInt(contentLength || '0', 10);

    if (acceptRanges === 'bytes' && totalSize > 0) {
      // Server supports range requests - use chunked download
      return await downloadWithRanges(deviceID, fileID, totalSize, onProgress);
    } else {
      // Fallback to regular chunked download
      return await downloadWithoutRanges(response, onProgress);
    }
    
  } catch (error) {
    return Promise.reject(error);
  }
}

async function downloadWithRanges(
  deviceID: string, 
  fileID: string, 
  totalSize: number,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const CHUNK_SIZE = 1024 * 1024 * 5; // 1MB chunks
  const MAX_PARALLEL = 5; // Maximum parallel downloads
  
  const chunks: Array<{start: number, end: number, data?: Uint8Array}> = [];
  let start = 0;
  
  // Calculate all chunks
  while (start < totalSize) {
    const end = Math.min(start + CHUNK_SIZE - 1, totalSize - 1);
    chunks.push({ start, end });
    start = end + 1;
  }

  let completed = 0;
  
  // Download chunks in parallel with limits
  const downloadPromises = [];
  for (let i = 0; i < chunks.length; i += MAX_PARALLEL) {
    const chunkGroup = chunks.slice(i, i + MAX_PARALLEL);
    
    const groupPromises = chunkGroup.map(async (chunk, index) => {
      try {
        const response = await fetch(
          `/bvcsp/v1/pu/download/${deviceID}/${fileID}?token=${localStorage.getItem('serviceToken') || ''}`,
          {
            headers: {
              'Range': `bytes=${chunk.start}-${chunk.end}`
            }
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to download chunk ${chunk.start}-${chunk.end}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        chunk.data = new Uint8Array(arrayBuffer);
        
        completed++;
        if (onProgress) {
          const progress = (completed / chunks.length) * 100;
          onProgress(progress);
        }
        
      } catch (error) {
        console.error(`Error downloading chunk ${chunk.start}-${chunk.end}:`, error);
        throw error;
      }
    });

    // Wait for current group to finish before starting next
    await Promise.all(groupPromises);
    downloadPromises.push(...groupPromises);
  }

  // Wait for all downloads to complete
  await Promise.all(downloadPromises);

  // Combine all chunks in correct order
  const combined = new Uint8Array(totalSize);
  let position = 0;
  
  for (const chunk of chunks) {
    if (chunk.data) {
      combined.set(chunk.data, position);
      position += chunk.data.length;
    }
  }

  return new Blob([combined]);
}

// Fallback for servers that don't support range requests
async function downloadWithoutRanges(
  response: Response,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const contentLength = response.headers.get('content-length');
  const total = parseInt(contentLength || '0', 10);
  
  let loaded = 0;
  const reader = response.body?.getReader();
  
  if (!reader) {
    throw new Error('Response body is not readable');
  }

  const chunks: ArrayBuffer[] = [];
  
  while (true) {
    const { done, value } = await reader.read();
    
    if (done) break;
    
    chunks.push(value.buffer);
    loaded += value.length;
    
    if (onProgress && total > 0) {
      const progress = (loaded / total) * 100;
      onProgress(progress);
    }
  }

  return new Blob(chunks);
}


export async function downloadFiles(deviceID: string, fileID: string, fileName?: string): Promise<void> {
  try {
    const response = await fetch(`/bvcsp/v1/pu/download/${deviceID}/${fileID}`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    
    // Try to get filename from Content-Disposition header
    let finalFileName = fileName;
    if (!finalFileName) {
      const contentDisposition = response.headers.get('Content-Disposition');
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+?)"?$/);
        if (filenameMatch) {
          finalFileName = filenameMatch[1];
        }
      }
    }
    
    // Fallback filename
    finalFileName = finalFileName || `${deviceID}_${fileID}`;
    
    // Create and trigger download
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = finalFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
    
  } catch (error) {
    return Promise.reject(error);
  }
}
