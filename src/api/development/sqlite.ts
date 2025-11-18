// project-imports
import { h } from '@fullcalendar/core/preact';
import { FileRecord } from 'types/development/files';


export async function uploadDocument(
    file: FileRecord
) {
  try {
    const response = await fetch(`/sqlite/files/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('serviceToken') || ''
      },
      body: JSON.stringify(file)
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('File not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error upload file:', error);
    throw error;
  }
}

export async function getFiles(
  page: number = 1, 
  pageSize: number = 50, 
  filter: any = {}
) {
  try {
    // Build query parameters from filter
    const params = new URLSearchParams({
      page: page.toString(),
      limit: pageSize.toString(),
      ...filter
    });

    const response = await fetch(`/sqlite/files?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('serviceToken') || ''
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
}

export async function getFileByID(fileID: string) {
  try {
    const response = await fetch(`/sqlite/files/${fileID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('serviceToken') || ''
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('File not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching file:', error);
    throw error;
  }
}

export async function updateFileUploadStatus(
  fileID: string, 
  updateData: {
    cloud_uploaded?: boolean;
    uploaded_time?: number;
  }
) {
  try {
    const response = await fetch(`/sqlite/files/${fileID}`, {
      method: 'PUT', // or 'PATCH' if you prefer
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('serviceToken') || ''
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('File not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating file:', error);
    throw error;
  }
}
