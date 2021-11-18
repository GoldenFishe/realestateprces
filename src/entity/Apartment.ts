import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Apartment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({type: "bigint"})
    price: number;

    @Column()
    externalId: string;

    @Column()
    city: string;

    @Column()
    district: string;

    @Column()
    rooms: number;

    @Column()
    square: number;

    @CreateDateColumn({type: "date"})
    date: Date
}