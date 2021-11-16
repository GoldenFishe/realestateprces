import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Apartment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({type: "bigint"})
    price: number;

    @Column({unique: true})
    externalId: string;

    @CreateDateColumn({type: "date"})
    date: Date
}