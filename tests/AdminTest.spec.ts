import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('https://qa.instulearn.com/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email:' }).click();
    await page.getByRole('textbox', { name: 'Email:' }).fill('elif@instulearn.com');
    await page.getByRole('textbox', { name: 'Password:' }).click();
    await page.getByRole('textbox', { name: 'Password:' }).fill('Instu2025!');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: ' Users ' }).click();
    await page.getByRole('link', { name: 'Instructors' }).click();
    await page.getByRole('button', { description: 'Delete', exact: true }).click();
    await page.getByRole('link', { name: 'Yes' }).click();
});