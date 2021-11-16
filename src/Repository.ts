import {createConnection} from "typeorm";
import {Apartment} from "./entity/Apartment";

export class Repository {
    async saveApartment(data: Apartment) {
        const repository = await Repository.getRepository();
        if (repository) {
            return repository.save(data);
        } else {
            throw new Error("Can't get repository")
        }
    }

    async getAllApartment() {
        const repository = await Repository.getRepository();
        return repository.find();
    }

    private static async getRepository() {
        try {
            const connection = await createConnection()
            return connection.getRepository(Apartment);
        } catch (err) {
            throw err;
        }
    }
}