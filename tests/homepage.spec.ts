import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("Vellera Yarns");
});

test('has logo', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Click the get started link.
  await page.getByTitle('Vellera Yarns').click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL('http://localhost:3000');
});

test('has my account link', async({page}) => {
    await page.goto('http://localhost:3000');
    await page.getByTitle('My Account').click();
    await expect(page).toHaveURL('http://localhost:3000');
});

test('has my cart link', async({page}) => {
    await page.goto('http://localhost:3000');
    await page.getByTitle('Shopping Cart').click();
    await expect(page).toHaveURL('http://localhost:3000');
});

test('has navigation links', async({page}) => {
    await page.goto('http://localhost:3000');
    const navigation = await page.getByRole('navigation');

    await navigation.getByTitle('Go to Yarn').click();
    await expect(page).toHaveURL('http://localhost:3000/product');

    await navigation.getByTitle('Go to Patterns').click();
    await expect(page).toHaveURL('http://localhost:3000/product');

    await navigation.getByTitle('Go to Tools').click();
    await expect(page).toHaveURL('http://localhost:3000/product');

    await navigation.getByTitle('Go to Learning Center').click();
    await expect(page).toHaveURL('http://localhost:3000');
});

test('has Shop Yarn tile', async({page}) => {
  await page.goto('http://localhost:3000');
  await page.getByTitle('Shop Yarn').click();
  await expect(page).toHaveURL('http://localhost:3000/product');
});

test('has Shop Patterns tile', async({page}) => {
  await page.goto('http://localhost:3000');
  await page.getByTitle('Shop Patterns').click();
  await expect(page).toHaveURL('http://localhost:3000/product');
});

test('has Shop Tools tile', async({page}) => {
  await page.goto('http://localhost:3000');
  await page.getByTitle('Shop Tools').click();
  await expect(page).toHaveURL('http://localhost:3000/product');
});

test('has Learning Center tile', async({page}) => {
  await page.goto('http://localhost:3000');
  await page.getByTitle('Learning Center', {exact:true}).click();
  await expect(page).toHaveURL('http://localhost:3000');
});