import { test, expect } from '@playwright/test';
import { ReusableMethods } from '../utils/ReusableMethods';
import {ClickUtils} from "../utils/clickUtils";
import {SendKeysUtils} from "../utils/SendKeysUtils";

test('US003_TC01 --> Anasayfa body bölümünde \'Transform Your Future with InstuLearn...\' baslıgı görünür olmalı', async ({ page }) => {

    const methods = new ReusableMethods(page);
    console.log("=".repeat(60));
    console.log('✅US003_TC01 --> Anasayfa body bölümünde \'Transform Your Future with InstuLearn...\' baslıgı görünür olmalı');
    console.log("=".repeat(60));

    await page.goto('https://qa.instulearn.com/');

    // Use a more flexible text match or a more specific selector
    const futureText = page.getByText('Transform Your Future with InstuLearn...', { exact: false });
    await methods.verifyText(futureText, 'Transform Your Future with InstuLearn...');

});

test('US003_TC01_V2 --> Anasayfa body bölümünde \'Transform Your Future with InstuLearn...\' baslıgı görünür olmalı', async ({ page }) => {

    const methods = new ReusableMethods(page);
    console.log("=".repeat(60));
    console.log('✅US003_TC01_V2 --> Anasayfa body bölümünde \'Transform Your Future with InstuLearn...\' baslıgı görünür olmalı');
    console.log("=".repeat(60));

    await page.goto('https://qa.instulearn.com/');

    // Use a more specific selector for the heading
    const futureText = page.locator('h1, h2, h3').filter({ hasText: 'Transform Your Future with InstuLearn...' });
    await methods.verifyText(futureText, 'Transform Your Future with InstuLearn...');

});

test('US003_TC01_V3 --> Anasayfa body bölümünde \'Transform Your Future with InstuLearn...\' baslıgı görünür olmalı', async ({ page }) => {

    const methods = new ReusableMethods(page);
    console.log("=".repeat(60));
    console.log('✅US003_TC01_V3 --> Anasayfa body bölümünde \'Transform Your Future with InstuLearn...\' baslıgı görünür olmalı');
    console.log("=".repeat(60));

    await page.goto('https://qa.instulearn.com/');

    // Use a regex pattern to match the start of the text
    const futureText = page.getByText(/Transform Your Future with InstuLearn\.\.\./);
    await methods.verifyText(futureText, 'Transform Your Future with InstuLearn...');

});

test('US003_TC01_V4 --> Anasayfa body bölümünde \'Transform Your Future with InstuLearn...\' baslıgı görünür olmalı', async ({ page }) => {

    const methods = new ReusableMethods(page);
    console.log("=".repeat(60));
    console.log('✅US003_TC01_V4 --> Anasayfa body bölümünde \'Transform Your Future with InstuLearn...\' baslıgı görünür olmalı');
    console.log("=".repeat(60));

    await page.goto('https://qa.instulearn.com/');

    // Check if the text exists and is visible
    const futureText = page.getByText('Transform Your Future with InstuLearn...');
    await expect(futureText).toBeVisible();

});
// search?search=Math
// Anasayfa body bolumunde search box gorunur ve aktif olmalı

test('US003_TC02 --> Anasayfa body bölümünde search box gorunur ve aktif olmalı', async ({ page }) => {
    await page.goto('https://qa.instulearn.com/');

    const methods = new ReusableMethods(page);
    console.log("=".repeat(60));
    console.log('✅US003_TC01_V4 --> Anasayfa body bölümünde \'Transform Your Future with InstuLearn...\' baslıgı görünür olmalı');
    console.log("=".repeat(60));

    await expect(page.getByRole('textbox', { name: 'Search courses and' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Search courses and' }).fill('Math');
    await page.getByRole('textbox', { name: 'Search courses and' }).press('Enter');
    await page.getByRole('button', { name: 'Search' }).click();

    await expect(page).toHaveURL(/search\?search=Math/);

    await methods.verifyUrl('Math')

});

// Search butonu gorunur ve aktif olmalı
test('US003_TC03 --> Anasayfa body bölümünde search butonu gorunur ve aktif olmalı', async ({ page }) => {

    await page.goto('https://qa.instulearn.com/');

    const methods = new ReusableMethods(page);

    console.log("=".repeat(60));
    console.log('✅US003_TC03 --> Anasayfa body bölümünde search butonu gorunur ve aktif olmalı');
    console.log("=".repeat(60));

    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();

});