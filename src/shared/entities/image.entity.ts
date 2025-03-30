import {ApiProperty} from "@nestjs/swagger";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {AutoMap} from "nestjsx-automapper";

@Entity('image')
export class Image {
    @AutoMap()
    @PrimaryGeneratedColumn()
    id: number;

    @AutoMap()
    @Column()
    imageData: string;
}