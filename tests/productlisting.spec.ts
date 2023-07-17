import { test, expect } from '@playwright/test';

test('has product tiles', async ({ page }) => {
    await page.goto('http://localhost:3000/product');
    await page.waitForSelector('div[data-testid="product-tile"]');
    const tiles = await page.getByTestId("product-tile").all();
    expect(tiles).toHaveLength(15);
});

test('has correct product tile data', async ({page}) => {
    await page.goto('http://localhost:3000/product');
    await page.waitForSelector('div[data-testid="product-tile"]');
    const tileText = await page.getByTestId("product-tile").nth(2).textContent();
    expect(tileText).toContain("Vellera");
    expect(tileText).toContain("Sabiduria");
    expect(tileText).toContain("Fingering");
    expect(tileText).toContain("100% Pima Cotton");
    expect(tileText).toContain("$15.00");
});

test('has correct page count', async ({page}) => {
    await page.goto('http://localhost:3000/product');
    await page.waitForSelector('span[data-testid="page-selector"]');
    const pageCount = await page.getByTestId("page-selector").count();
    expect(pageCount).toEqual(8);
});

test('clicking on page link updates results', async ({page}) => {
    await page.goto('http://localhost:3000/product');
    await page.waitForSelector('span[data-testid="page-selector"]');
    await page.getByTestId("page-selector").nth(7).click();
    
    await page.waitForFunction(() => {
        const tiles = document.querySelectorAll("[data-testid='product-tile']");
        return tiles.length === 3;
    })


    await page.waitForSelector('div[data-testid="product-tile"]');
    const tiles = await page.getByTestId("product-tile").all();
    expect(tiles).toHaveLength(3);
});

test('click on filters updates results', async ({page}) => {
    await page.goto('http://localhost:3000/product');
    await page.waitForSelector('[data-testid="filter"]');
    await page.getByTestId("filter").getByText("Black").click();
    await page.getByTestId("filter").getByText("Fingering").click();
    await page.getByTestId("filter").getByText("Sport").click();

    await page.waitForFunction(() => {
        const tiles = document.querySelectorAll("[data-testid='product-tile']");
        return tiles.length === 6;
    })

    const tiles = await page.getByTestId("product-tile").all();
    expect(tiles).toHaveLength(6);
});