/*global describe, it, expect, browser, element, by*/
describe('Demo', function () {
	it('should navigate to the index page', function () {
		browser.get('/');
		expect(element(by.id('content')).getText()).toMatch('Hello World');
	});
});