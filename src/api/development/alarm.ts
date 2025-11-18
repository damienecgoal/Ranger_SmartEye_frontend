// project-imports
import { h } from '@fullcalendar/core/preact';
import { Alarm } from 'types/development/alarm';

interface ApiResponse {
  code: number;
  msg: string;
  pageInfo: {
    page: number;
    pageSize: number;
    totalCount: number;
  };
  data: Alarm[];
}

export async function getalarm(page: Number, pageSize: Number, filter: any) {
  try {
    const response = await fetch('/bvcsp/v1/alarm', {
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
    }
);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse: ApiResponse = await response.json();

    if (apiResponse.code !== 0) {
      throw new Error(`API error: ${apiResponse.msg}`);
    }

    // console.log('response', await response.json());

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
    return error;
  }
}