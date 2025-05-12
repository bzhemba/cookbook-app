import {Injectable, Inject, NotFoundException} from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import * as Stream from "node:stream";
import {Readable} from "typeorm/browser/platform/BrowserPlatformTools";

@Injectable()
export class StorageService {
    constructor(
        @Inject('S3_CLIENT') private readonly s3: S3,
        private config: ConfigService,
    ) {}

    async uploadFile(file: Express.Multer.File, path: string) {
        const params = {
            Bucket: this.config.get('STORAGE_BUCKET'),
            Key: path,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        return this.s3.upload(params).promise();
    }

    async getFileUrl(key: string) {
        return this.s3.getSignedUrlPromise('getObject', {
            Bucket: this.config.get('STORAGE_BUCKET'),
            Key: key
        });
    }

    async getFileStream(key: string): Promise<{
        stream: Readable;
        contentType: string;
    }> {
        const params = {
            Bucket: this.config.get('STORAGE_BUCKET'),
            Key: key
        };

        const data = await this.s3.getObject(params).promise();

        return {
            stream: data.Body as Readable,
            contentType: data.ContentType || 'application/octet-stream'
        };
    }
}