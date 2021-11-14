import puppeteer, {Page} from "puppeteer";
// import fs from 'fs/promises';

const URL = 'https://www.cian.ru/kupit-kvartiru/'
let CURRENT_PAGE = 1;

async function application() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(URL, {waitUntil: "domcontentloaded"});

    await goToNextPage(page, CURRENT_PAGE + 1)
    await goToNextPage(page, CURRENT_PAGE + 2)

    // const getApartmentsPromises = [];
    // getApartmentsPromises.push(getApartments(page))
    //
    // const apartments = Promise.all(getApartmentsPromises);
    //
    // const data = {[getDate()]: apartments}
    // saveData(JSON.stringify(data));

    await browser.close();
}

application();

// async function saveData(data: string) {
//     try {
//         await fs.appendFile('file.json', data);
//     } catch (err) {
//         console.log(err);
//     }
// }
//
// async function getApartments(page: Page) {
//     const apartmentSelector = '[data-name="CardComponent"]';
//     const apartments = await page.$$(apartmentSelector);
//     const getDataPromises = [];
//     for (let apartment of apartments) {
//         getDataPromises.push(getDataFromApartment(apartment))
//     }
//     return Promise.all(getDataPromises);
// }
//
// async function getDataFromApartment(apartment: ElementHandle) {
//     const getIdPromise = getId(apartment);
//     const getPricePromise = getPrice(apartment);
//     const getTitlePromise = getTitle(apartment);
//     const [id, price, title] = await Promise.all([getIdPromise, getPricePromise, getTitlePromise])
//     return {id, price, title};
// }
//
// async function getId(apartment: ElementHandle) {
//     const idSelector = '[data-name="LinkArea"] a[href*="flat/"]';
//     const id = await apartment.$eval(idSelector, idElement => idElement.getAttribute("href"));
//     if (id) {
//         const formatId = (id: string) => (/(?<=\/)\d+(?=\/$)/.exec(id) as RegExpExecArray)[0];
//         return formatId(id);
//     } else {
//         throw new Error(`Can't get id: ${id}`)
//     }
// }
//
// async function getPrice(apartment: ElementHandle) {
//     const priceSelector = '[data-mark="MainPrice"]';
//     const price = await apartment.$eval(priceSelector, priceElement => priceElement.textContent);
//     if (price) {
//         const trimmedPrice = price.replace(/\s/gm, '')
//         return Number.parseInt(trimmedPrice)
//     } else {
//         throw new Error(`Can't get price: ${price}`)
//     }
// }
//
// async function getTitle(apartment: ElementHandle) {
//     const titleSelector = '[data-mark="OfferTitle"]';
//     const title = await apartment.$eval(titleSelector, priceElement => priceElement.textContent);
//     if (title) {
//         return title
//     } else {
//         throw new Error(`Can't get price: ${title}`)
//     }
// }
//
// function getDate() {
//     const date = new Date();
//     const monthDate = date.getDate();
//     const month = date.getMonth();
//     const year = date.getFullYear();
//     return `${monthDate}-${month}-${year}`;
// }
//

async function goToNextPage(page: Page, nextPage: number) {
    const pagination = await page.$x(`[data-name="Pagination"] ul //a[contains(text(), "${nextPage}")]`);
    console.log(pagination);
    pagination?.click();
}