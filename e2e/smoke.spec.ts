import { expect, test } from '@playwright/test';

test.describe('smoke: app and API are up', () => {
  test('catalog page renders the navigation and reaches the API', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Catalog' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Project catalog' })).toBeVisible();
    await expect(page.getByText('API: ok')).toBeVisible();
  });

  test('unknown route shows the not-found page with a way back', async ({ page }) => {
    await page.goto('/does-not-exist');
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
    await page.getByRole('link', { name: 'Go to catalog' }).click();
    await expect(page).toHaveURL('/');
  });
});
