import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream((error, result) => {
                if (error) return reject(error);
                if (!result) return reject(new Error('Unknown error: upload result is undefined'));
                resolve(result);
            });

            const { Readable } = require('stream');
            const readableStream = new Readable();
            readableStream.push(file.buffer);
            readableStream.push(null);
            readableStream.pipe(upload);
        });
    }
}
