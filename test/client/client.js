const { app } = require('../common');

const Nightmare = require('nightmare');
const chai = require('chai');
const expect = chai.expect;

let describe = global.describe;

// Skip all the tests if we don't have a graphical environment
if (!('DISPLAY' in process.env)) {
    describe = describe.skip;
}

describe('Client', function () {
    let httpServer;
    before((done) => {
        httpServer = app.listen(8001, '127.0.0.1', () => { done(); });
    });
    after((done) => {
        httpServer.close(() => { done(); });
    });

    this.timeout('10s');

    let nightmare = null;
    beforeEach(() => {
        nightmare = new Nightmare();
    });

    describe('when logging in with correct credentials', () => {
        it('should redirect to homepage', () => {
            return nightmare.goto('http://127.0.0.1:8001/login')
                .type('#username', 'administrator')
                .type('#passwd', 'widestage')
                .click('#login button')
                .wait(2000)
                .end()
                .evaluate(() => {
                    return document.location;
                })
                .then(function (location) {
                    expect(location.pathname).to.equals('/');
                    expect(location.hash).to.equals('#/home');
                });
        });
    });
});
