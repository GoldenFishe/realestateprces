import {ElementHandle} from "puppeteer";

// TODO: Поменять название
export type Flat = {
    externalId: string;
    price: number;
    title: string;
    city: string;
    district: string;
    rooms: number;
    square: number;
}

export abstract class Apartment {
    protected readonly abstract apartment: ElementHandle;

    public abstract getApartment(): Promise<Flat>

    protected abstract getId(): Promise<string>

    protected abstract getPrice(): Promise<number>

    protected abstract getTitle(): Promise<string>

    protected abstract getCity(): Promise<string>

    protected abstract getDistrict(): Promise<string>

    protected abstract getRooms(): Promise<number>

    protected abstract getSquare(): Promise<number>
}