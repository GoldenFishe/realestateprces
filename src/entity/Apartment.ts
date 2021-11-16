import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Apartment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    price: number;

    @Column()
    externalId: string;
}