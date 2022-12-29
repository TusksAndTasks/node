import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {User} from "./user";

@Entity()
export class Message {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    content!: string;

    @ManyToOne(() => User, (user) => user.name, {eager: true, cascade: true})
    @JoinColumn()
    author!: User

    @ManyToOne(() => Message, {cascade: true, nullable: true})
    @JoinColumn()
    responseTo!: Message

    @Column({nullable: true})
    responseToId!: number;

    @Column()
    time!: string;

    @Column()
    room!: string;

}