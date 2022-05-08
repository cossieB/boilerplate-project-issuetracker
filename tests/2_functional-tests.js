const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const Browser = require('zombie')
Browser.site = "http://localhost:5000";

suite('Functional Tests with Zombie.js', function () {
    this.timeout(5000);
    const browser = new Browser();

    suiteSetup(function (done) {
        return browser.visit('/', done);
    });

    suite('Headless browser', function () {
        test('should have a working "site" property', function () {
            assert.isNotNull(browser.site);
        });
    });

    suite('Form Input', function () {
        
        test('Every field', async () => {
            await browser.fill('issue_title', 'test')
            await browser.fill('issue_text', 'testing testing 123')
            await browser.fill('created_by', 'John Doe')
            await browser.fill('assigned_to', 'John Doe')
            await browser.fill('status_text', 'statusMsg')
            const res = await browser.pressButton('Submit Issue')
            browser.assert.success()
            browser.assert.elements('code#jsonResult', 1)
            browser.assert.text('code#jsonResult', "DKfjsdklfjlksd")
            
        })
    })
})