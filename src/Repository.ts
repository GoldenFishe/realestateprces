import {Connection, createConnection} from "typeorm";
import {Apartment} from "./entity/Apartment";
import {Apartment as ApartmentType} from "./types";

//Singleton
export class Repository {
    private static instance: Repository;
    private connection: Connection;

    private constructor() {

    }

    static Instance() {
        Repository.instance = Repository.instance ? Repository.instance : new Repository();
        return this.instance;
    }
    async saveApartment(data: ApartmentType) {
        const repository = await this.getRepository();
        if (repository) {
            const apartment = repository.create(data)
            return repository.save(apartment);
        } else {
            throw new Error("Can't get repository")
        }
    }

    async getAllApartment() {
        const repository = await this.getRepository();
        return repository.find();
    }

    async createConnection() {
        this.connection = await createConnection();
    }

    private getRepository() {
        return this.connection.getRepository(Apartment);
    }
}