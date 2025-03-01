import {ApiProperty} from "@nestjs/swagger";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {AutoMap} from "nestjsx-automapper";

@Entity('picture')
export class Picture {
    @AutoMap()
    @PrimaryGeneratedColumn()
    id: number;

    @AutoMap()
    @Column({ type: 'bytea' })
    imageData: Buffer;
}