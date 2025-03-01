import {ApiProperty} from "@nestjs/swagger";

export class PictureDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    imageData: Buffer;
}