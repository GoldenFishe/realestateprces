import puppeteer, {ElementHandle, Page} from "puppeteer";
import "reflect-metadata";

import {CianApartment} from "./classes/CianApartment";
import {Repository} from "./Repository";
import {Flat} from "./classes/Apartment";

const URL = 'https://www.cian.ru/kupit-kvartiru/'
let CURRENT_PAGE = 1;
const MAX_PAGE = 50;

async function application() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(URL, {waitUntil: "domcontentloaded"});

    const apartments: Flat[] = [];

    console.log(`Current page: ${CURRENT_PAGE}`);
    for (let i = CURRENT_PAGE; i < MAX_PAGE; i++) {
        const a = await getApartments(page)
        apartments.push(...a)
        await goToNextPage(page);
        await page.waitForTimeout(1000);
    }

    console.log(`Total apartments: ${apartments.length}`)

    saveData(apartments);

    await browser.close();
}

application();

async function saveData(apartments: Flat[]) {
    const repository = Repository.Instance();
    await repository.createConnection();

    for (let apartment of apartments) {
        await repository.saveApartment(apartment);
    }
}

async function getApartments(page: Page) {
    const apartmentSelector = '[data-name="CardComponent"]';
    const apartments = await page.$$(apartmentSelector);
    const getDataPromises: Promise<Flat>[] = [];
    for (let apartment of apartments) {
        getDataPromises.push(getDataFromApartment(apartment))
    }

    return await Promise.all(getDataPromises);
}

async function getDataFromApartment(apartmentElementHandle: ElementHandle): Promise<Flat> {
    const apartment = new CianApartment(apartmentElementHandle);
    return await apartment.getApartment();
}

async function goToNextPage(page: Page) {
    const pagination = await page?.$x(`//*[@data-name="Pagination"]//a[text() = '${CURRENT_PAGE + 1}']`);
    const [p] = pagination;
    const pageNumber = await p?.evaluate(e => e.textContent)
    console.log(`Current page: ${pageNumber}`);
    await Promise.all([
        p?.click(),
        page.waitForNavigation()
    ]);
    CURRENT_PAGE++;
}
