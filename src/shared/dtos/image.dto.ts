import {ApiProperty} from "@nestjs/swagger";

export class ImageDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    imageData: string;
}