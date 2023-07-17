import { test, expect } from '@playwright/test';
import { ProductType } from '../src/lib/ProductType';

test('return default product list', async ({ request }) => {
    const productApi = await request.get('http://localhost:3000/api/product');
    expect(productApi.ok()).toBeTruthy();
    const products = await productApi.json();
    expect(products.products.length).toEqual(15);
    expect(products.meta.page).toEqual(1);
    expect(products.meta.maxPages).toEqual(8);
});

test('return product list with fiber filter', async ({ request }) => {
    const productApi = await request.get('http://localhost:3000/api/product?fiber=wool');
    expect(productApi.ok()).toBeTruthy();
    const products = await productApi.json();
    products.products.forEach((prod:ProductType) => {
        expect(prod.fiber).toContain('Wool');
    })
    expect(products.meta.maxPages).toEqual(3);
});

test('return product list with color filter', async ({ request }) => {
    const productApi = await request.get('http://localhost:3000/api/product?color=black,gray,red');
    const filterTags = ['black', 'gray', 'red'];

    expect(productApi.ok()).toBeTruthy();
    const products = await productApi.json();
    products.products.forEach((prod:ProductType) => {
        const containsFilter = filterTags.some(tag => prod.tags.includes(tag));
        expect(containsFilter).toBe(true);
    })
    expect(products.meta.maxPages).toEqual(3);
});

test('return product list with weight filter', async ({ request }) => {
    const productApi = await request.get('http://localhost:3000/api/product?weight=sport,dk');
    const filterTags = ['sport', 'dk'];

    expect(productApi.ok()).toBeTruthy();
    const products = await productApi.json();
    products.products.forEach((prod:ProductType) => {
        const containsFilter = filterTags.some(tag => prod.tags.includes(tag));
        expect(containsFilter).toBe(true);
    })
    expect(products.meta.maxPages).toEqual(4);
});

test('return product list with weight and color filters', async ({ request }) => {
    const productApi = await request.get('http://localhost:3000/api/product?weight=sport&color=gray');
    const filterTags = ['sport', 'gray'];

    expect(productApi.ok()).toBeTruthy();
    const products = await productApi.json();
    products.products.forEach((prod:ProductType) => {
        const containsFilter = filterTags.some(tag => prod.tags.includes(tag));
        expect(containsFilter).toBe(true);
    })
    expect(products.products.length).toEqual(3);
    expect(products.meta.maxPages).toEqual(1);
});
