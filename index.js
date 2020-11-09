const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const search_string = "marrakech";

    await page.goto(`https://www.ludopedia.com.br/search_jogo?search=${search_string}`);
    
    const searchList = await page.evaluate(() => {
        const imageNodeList = document.querySelectorAll("[id^='resultado anchor']:not([id$='_test_field']) img");
        const titleNodeList = document.querySelectorAll("[id^='resultado anchor']:not([id$='_test_field']) h4.mar-no");
        
        const imageArr = [...imageNodeList].map(({src}) => src);
        const finalArr = [...titleNodeList].map(({ innerText }, index) => ({ title: innerText, image: imageArr[index] }));

        return finalArr;
    });

    fs.writeFile(`${search_string.split('+').join('_')}.json`, JSON.stringify(searchList, null, 2), error => {
        if(error) {
            throw new Error("Alguma coisa deu errado ai :/", error);
        }

        console.log("Deu tudo bom! :D");
    });

    await browser.close();
})();