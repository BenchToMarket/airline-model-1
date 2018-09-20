import { AngularTestPage } from './app.po';
import { browser, element, by } from 'protractor';

describe('Starting tests for airline-app-1', function() {
  let page: AngularTestPage;

  beforeEach(() => {
    page = new AngularTestPage();
  });

  it('website title should be airline-app-1', () => {
    page.navigateTo('/');
    return browser.getTitle().then((result)=>{
      expect(result).toBe('airline-app-1');
    })
  });

  it('navbar-brand should be airline-model-1@0.1.8',() => {
    var navbarBrand = element(by.css('.navbar-brand')).getWebElement();
    expect(navbarBrand.getText()).toBe('airline-model-1@0.1.8');
  });

  // Passenger
    it('Passenger component should be loadable',() => {
      page.navigateTo('/Passenger');
      var assetName = browser.findElement(by.id('assetName'));
      expect(assetName.getText()).toBe('Passenger');
    });

    it('Passenger table should have 8 columns',() => {
      page.navigateTo('/Passenger');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(8); // Addition of 1 for 'Action' column
      });
    });


    
      // Flight
      it('Flight component should be loadable',() => {
        page.navigateTo('/Flight');
        var assetName = browser.findElement(by.id('assetName'));
        expect(assetName.getText()).toBe('Flight');
      });
  
      it('Flight table should have 8 columns',() => {
        page.navigateTo('/Flight');
        element.all(by.css('.thead-cols th')).then(function(arr) {
          expect(arr.length).toEqual(8); // Addition of 1 for 'Action' column
        });
      });

      /*
        // Participant
    it('Participant component should be loadable',() => {
      page.navigateTo('/Participant');
      var assetName = browser.findElement(by.id('assetName'));
      expect(assetName.getText()).toBe('Participant');
    });

    it('Participant table should have 8 columns',() => {
      page.navigateTo('/Participant');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(8); // Addition of 1 for 'Action' column
      });
    });
    */


    // Ticket
    it('Ticket component should be loadable',() => {
      page.navigateTo('/Ticket');
      var assetName = browser.findElement(by.id('assetName'));
      expect(assetName.getText()).toBe('Ticket');
    });

    it('Ticket table should have 8 columns',() => {
      page.navigateTo('/Ticket');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(8); // Addition of 1 for 'Action' column
      });
    });

  
    it('Contract_100 component should be loadable',() => {
      page.navigateTo('/Contract_100');
      var assetName = browser.findElement(by.id('assetName'));
      expect(assetName.getText()).toBe('Contract_100');
    });

    it('Contract_100 table should have 7 columns',() => {
      page.navigateTo('/Contract_100');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(7); // Addition of 1 for 'Action' column
      });
    });

  

});
