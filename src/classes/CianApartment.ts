import {ElementHandle} from "puppeteer";
import {Apartment} from "./Apartment";

export class CianApartment extends Apartment {
    protected readonly apartment: ElementHandle;

    constructor(apartment: ElementHandle) {
        super();
        this.apartment = apartment;
    }

    public async getApartment() {
        const getIdPromise = this.getId();
        const getPricePromise = this.getPrice();
        const getTitlePromise = this.getTitle();
        const getCityPromise = this.getCity();
        const getDistrictPromise = this.getDistrict();
        const [externalId, price, title, city, district] = await Promise.all([getIdPromise, getPricePromise, getTitlePromise, getCityPromise, getDistrictPromise])
        return {externalId, price, title, city, district};
    }

    protected async getId() {
        const idSelector = '[data-name="LinkArea"] a[href*="flat/"]';
        const id = await this.apartment.$eval(idSelector, idElement => idElement.getAttribute("href"));
        if (id) {
            const formatId = (id: string) => (/(?<=\/)\d+(?=\/$)/.exec(id) as RegExpExecArray)[0] as string;
            return formatId(id);
        } else {
            throw new Error(`Can't get id: ${id}`)
        }
    }

    protected async getPrice() {
        const priceSelector = '[data-mark="MainPrice"]';
        const price = await this.apartment.$eval(priceSelector, priceElement => priceElement.textContent);
        if (price) {
            const trimmedPrice = price.replace(/\s/gm, '')
            return Number.parseInt(trimmedPrice)
        } else {
            throw new Error(`Can't get price: ${price}`)
        }
    }

    protected async getTitle() {
        const titleSelector = '[data-mark="OfferTitle"]';
        const title = await this.apartment.$eval(titleSelector, priceElement => priceElement.textContent);
        if (title) {
            return title
        } else {
            throw new Error(`Can't get price: ${title}`)
        }
    }

    protected async getCity() {
        const citySelector = '[data-name="GeoLabel"]';
        const city = await this.apartment.$$eval(citySelector, priceElement => priceElement[0]?.textContent);
        if (city) {
            return city
        } else {
            throw new Error(`Can't get city: ${city}`)
        }
    }

    protected async getDistrict() {
        const districtSelector = '[data-name="GeoLabel"]';
        const district = await this.apartment.$$eval(districtSelector, priceElement => priceElement[1]?.textContent);
        if (district) {
            return district
        } else {
            throw new Error(`Can't get district: ${district}`)
        }
    }
}