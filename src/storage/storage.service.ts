import { Injectable, Inject } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'typeorm/browser/platform/BrowserPlatformTools';
import { GetObjectOutput } from 'aws-sdk/clients/s3';

@Injectable()
export class StorageService {
  constructor(
    @Inject('S3_CLIENT') private readonly s3: S3,
    private config: ConfigService,
  ) {}

  async uploadFile(file: Express.Multer.File, path: string) {
    const bucket = this.config.get<string>('STORAGE_BUCKET');
    if (!bucket) {
      throw new Error('Storage bucket configuration is missing');
    }

    const params: AWS.S3.PutObjectRequest = {
      Bucket: bucket,
      Key: path,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    return this.s3.upload(params).promise();
  }

  async getFileUrl(key: string) {
    return this.s3.getSignedUrlPromise('getObject', {
      Bucket: this.config.get<string>('STORAGE_BUCKET'),
      Key: key,
    });
  }

  async getFileStream(key: string): Promise<{
    stream: Readable;
    contentType: string;
  }> {
    const bucket = this.config.get<string>('STORAGE_BUCKET');
    if (!bucket) {
      throw new Error('Storage bucket configuration is missing');
    }

    const params: AWS.S3.GetObjectRequest = {
      Bucket: bucket,
      Key: key,
    };

    const data: GetObjectOutput = await this.s3.getObject(params).promise();

    if (!data.Body) {
      throw new Error('File not found or empty');
    }

    return {
      stream: data.Body as Readable,
      contentType: data.ContentType || 'application/octet-stream',
    };
  }
}
