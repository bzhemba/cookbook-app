import {AutoMap} from "nestjsx-automapper";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../users/entities/user.entity";

@Entity('note')
export class Note {
    @AutoMap()
    @PrimaryGeneratedColumn()
    id: number;

    @AutoMap()
    @Column()
    text: string;

    @AutoMap()
    @ManyToOne(() => User, user => user.recipes,
        {onDelete: 'CASCADE'})
    createdByUser: User;
}