import puppeteer, {ElementHandle, Page} from "puppeteer";
import "reflect-metadata";

import {Apartment} from "./types";
import {Repository} from "./Repository";

const URL = 'https://www.cian.ru/kupit-kvartiru/'
let CURRENT_PAGE = 1;
const MAX_PAGE = 50;

async function application() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(URL, {waitUntil: "domcontentloaded"});

    const apartments: Apartment[] = [];

    for (let i = CURRENT_PAGE; i < MAX_PAGE; i++) {
        const a = await getApartments(page)
        apartments.push(...a)
        await goToNextPage(page);
        await page.waitForTimeout(1000);
    }

    saveData(apartments);

    await browser.close();
}

application();

async function saveData(apartments: Apartment[]) {
    const repository = Repository.Instance();
    await repository.createConnection();
    console.log(repository);
    for (let apartment of apartments) {
        await repository.saveApartment(apartment);
    }
}

async function getApartments(page: Page) {
    const apartmentSelector = '[data-name="CardComponent"]';
    const apartments = await page.$$(apartmentSelector);
    const getDataPromises: Promise<Apartment>[] = [];
    for (let apartment of apartments) {
        getDataPromises.push(getDataFromApartment(apartment))
    }

    return await Promise.all(getDataPromises);
}

async function getDataFromApartment(apartment: ElementHandle): Promise<Apartment> {
    const getIdPromise = getId(apartment);
    const getPricePromise = getPrice(apartment);
    const getTitlePromise = getTitle(apartment);
    const [externalId, price, title] = await Promise.all([getIdPromise, getPricePromise, getTitlePromise])
    return {externalId, price, title};
}

async function getId(apartment: ElementHandle) {
    const idSelector = '[data-name="LinkArea"] a[href*="flat/"]';
    const id = await apartment.$eval(idSelector, idElement => idElement.getAttribute("href"));
    if (id) {
        const formatId = (id: string) => (/(?<=\/)\d+(?=\/$)/.exec(id) as RegExpExecArray)[0] as string;
        return formatId(id);
    } else {
        throw new Error(`Can't get id: ${id}`)
    }
}

async function getPrice(apartment: ElementHandle) {
    const priceSelector = '[data-mark="MainPrice"]';
    const price = await apartment.$eval(priceSelector, priceElement => priceElement.textContent);
    if (price) {
        const trimmedPrice = price.replace(/\s/gm, '')
        return Number.parseInt(trimmedPrice)
    } else {
        throw new Error(`Can't get price: ${price}`)
    }
}

async function getTitle(apartment: ElementHandle) {
    const titleSelector = '[data-mark="OfferTitle"]';
    const title = await apartment.$eval(titleSelector, priceElement => priceElement.textContent);
    if (title) {
        return title
    } else {
        throw new Error(`Can't get price: ${title}`)
    }
}

async function goToNextPage(page: Page) {
    const pagination = await page?.$x(`//*[@data-name="Pagination"]//a[text() = '${CURRENT_PAGE + 1}']`);
    const [p] = pagination
    console.log(await p?.evaluate(e => e.textContent));
    await Promise.all([
        p?.click(),
        page.waitForNavigation()
    ]);
    CURRENT_PAGE++;
}
