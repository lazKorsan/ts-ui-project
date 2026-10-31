import {test} from "@playwright/test";
import {LoggerHelper} from "../../utils/LoggerHelper";
import {StudentPage} from "../../pages/StudentPage";
import {ReusableMethods} from "../../utils/ReusableMethods";


const credentialsDataSet = [

    {mail: "ahmet.student.94494@InstuLearn.com", password: "Query.2026!"},
    {mail: "ahmet.student.31237@InstuLearn.com", password: "Query.2026!"},
    {mail: "ahmet486@IntuLearn.com", password: "Query.2026!"}

];

for (const data of credentialsDataSet) {


    test(`US001StLoginTestTC02}: ${data.mail}`, async ({ page }) => {

        // * Kullanici anaSayfaya gider
        await page.goto('https://qa.instulearn.com/');
        LoggerHelper.logInfo("Kullanici anaSayfaya gider");

        const studentPage= new StudentPage(page);
        await studentPage.loginWithMethod( data.mail, data.password);
        LoggerHelper.logInfo("Kullanici basarili bir şekilde giris yapti. ");

        const methods=new ReusableMethods(page);
        await methods.verifyUrl('panel');

    });



}