export type FileRecord = {
  // Required (non-null)
  fileID: string;                                // NRU-generated
  nruID: string;
  puID: string;
  filePath: string;
  fileType: 'video' | 'audio' | 'image' | 'gps' | 'log' | 'firmware'; // App-level enum
  fileSize: number;
  beginTime: number;                              // Unix seconds
  insertTime: number;                             // Unix seconds

  // Optional
  puName?: string;
  userID?: string;
  userName?: string;
  channelIndex?: number;
  fileHash?: string;
  endTime?: number;
  recordReason?: string;
  desc1?: string;
  desc2?: string;
  fileName?: string;
  lat?: number;
  lng?: number;
  mark?: boolean;
  classID?: number;
  className?: string;
};
