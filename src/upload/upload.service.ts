import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  uploadImage(file: Express.Multer.File): string {
    if (!file) {
      throw new Error('Invalid file');
    }

    // 返回文件的相对路径或上传成功的信息
    return `uploads/${file.filename}`;
  }
}
