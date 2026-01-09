export interface IStorageService {
  uploadFile(buffer: Buffer, key: string, contentType: string): Promise<string>;
  deleteFile(key: string): Promise<void>;
}

