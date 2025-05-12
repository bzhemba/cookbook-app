import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StorageService } from './storage.service';
import * as AWS from 'aws-sdk';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: 'S3_CLIENT',
            useFactory: (config: ConfigService) => {
                const endpoint = config.get<string>('STORAGE_ENDPOINT');
                const accessKey = config.get<string>('STORAGE_ACCESS_KEY');
                const secretKey = config.get<string>('STORAGE_SECRET_KEY');

                if (!endpoint || !accessKey || !secretKey) {
                    throw new Error('Missing storage configuration');
                }

                return new AWS.S3({
                    endpoint: endpoint,
                    credentials: {
                        accessKeyId: accessKey,
                        secretAccessKey: secretKey,
                    },
                    region: 'ru-central1',
                });
            },
            inject: [ConfigService],
        },
        StorageService,
    ],
    exports: [StorageService],
})
export class StorageModule {}