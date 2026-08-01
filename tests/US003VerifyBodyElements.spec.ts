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