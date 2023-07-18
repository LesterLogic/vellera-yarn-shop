import { test, expect } from '@playwright/test';

test('shows 404 when no id is supplied', async ({ page }) => {
    const response = await page.request.get('http://localhost:3000/detail');
    await expect(response).not.toBeOK();
});

test('shows error when invalid id is supplied', async ({page}) => {
    await page.goto('http://localhost:3000/detail/10');
    const error = await page.getByTestId("error").textContent();
    expect(error).toEqual("Sorry, but there is no product to show you.");
});

test('shows details when valid id is supplied', async ({page}) => {
    await page.goto('http://localhost:3000/detail/9');
    const details = await page.getByTestId('details').textContent();
    const related = await page.getByTestId('related').textContent();

    expect(details).toContain('Malabrigo Mechita');
});

test('shows recommended products', async ({page}) => {
    await page.goto('http://localhost:3000/detail/4');
    const related = await page.getByTestId('related').textContent();
    expect(related).toContain('Consider these other options');

    await page.waitForFunction(() => {
        const tiles = document.querySelectorAll("[data-testid='related-tile']");
        return tiles.length === 8;
    });

    const relatedTiles = await page.getByTestId('related-tile').all();
    expect(relatedTiles).toHaveLength(8);
});