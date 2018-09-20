/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
below from: https://discourse.skcript.com/t/hyperledger-composer-nodejs-sdk-submiting-transactions/722
used param as the transaction defined in model
this seems to provide default values when testing
used "name" here, not sure if this has any meaning? 
*/
var passenger_id = 'eric';//@email.com';
var corporate_id = 'corp';//@email.com';
var pass_num_2_id = 'john';//@email.com';


/**
 * A transaction to send good to an organization
 * @param {org.acme.airline1.A03_IssueTickets} name A human description of the parameter
 * @transaction
 */
function  A03_IssueTickets(transaction) {
  
     var factory = getFactory();
     var NS = 'org.acme.airline1';

     var i;
     var sid;
     var newTicket;
     var newTickets = [];
  
    return getAssetRegistry("org.acme.airline1.Ticket").then(function(ticketRegistry) {  
  
        for (i = 1; i < 3; i++) {
            sid = 'B' + i;
            newTicket = factory.newResource("org.acme.airline1", "Ticket", sid);
            newTicket.classType = 'BUSINESS';
            newTicket.status = 'AVAIL';
            newTicket.flight = factory.newRelationship(NS, 'Flight', 'DLT111_2018_11_01');
            newTickets.push(newTicket); 
        }
        for (i = 2; i < 6; i++) {
            sid = 'E' + i;
            newTicket = factory.newResource("org.acme.airline1", "Ticket", sid);
            newTicket.classType = 'ECONOMY';
            newTicket.status = 'AVAIL';
            newTicket.flight = factory.newRelationship(NS, 'Flight', 'DLT111_2018_11_01');
            newTickets.push(newTicket); 
        }
      
        return ticketRegistry.addAll(newTickets);
    })
}


  //*************************************
  //*************************************
  //*************************************
  //*************************************  
  //*************************************
  //*************************************

  /**
   * A Passenger sells ticket back to airline
   * @param {org.acme.airline1.A21_SellTicket} sellTicket -
   * @transaction
   */
function A21_SellTicket(sellTicket) {
    // Sell Ticket to another Passenger
      
          console.log('Sell Ticket to another Passenger Function');
  /*  
   o FLightOccupancy fLightOccupancy
  --> Passenger newOwner
  */
  
    var factory = getFactory();
    var NS = 'org.acme.airline1';
    var contract = sellTicket.ticket.flight.contract; 
    var flight = sellTicket.ticket.flight;
    var ticket = sellTicket.ticket;
   
    var percentResale = contract.percentResale; 	// % of resale price to airline
    var premiumSeats = contract.premiumRemainingSeats; // may adjust based on seats remain
    var premiumDays = contract.premiumRemainingDays;   // may adjust based on days to flight
    var toAirline;
    var toSeller;
    
    var seller = ticket.pnr;
    var seller_bal = ticket.pnr.accountBalance; 
    var seller_wallet = seller.wallet;

    var buyer = sellTicket.newOwner;
    var buyer_bal = buyer.accountBalance; 
    var buyer_wallet = buyer.wallet;

    // *** Determine Market Price
    // will reflect supply & demand
    // here we will adjust on user imput
    var fLightOccupancy = sellTicket.fLightOccupancy
    var priceMultiplier; 
    var orgPrice = ticket.purchasePrice;
    var salePrice; 
  
    if (fLightOccupancy == 'EMPTY') {
           	priceMultiplier = 0.50;
        } else if (fLightOccupancy == 'AVERAGE') {
            priceMultiplier = 1.0;
        } else if (fLightOccupancy == 'FULL') {
      		priceMultiplier = 1.50;
        } else if (fLightOccupancy == 'OVERSOLD') {
        	priceMultiplier = 2.50;
    }

    salePrice = orgPrice * priceMultiplier;	//buyer pays
    toAirline = salePrice * percentResale;	//airline share
    toSeller = salePrice - toAirline;			//seller share
    
    // ****** Adjust each Registry
    // Seller (first to ensure ticket is in wallet
    seller.accountBalance += toSeller;   
    // remove ticket from seller wallet
        var index = seller_wallet.indexOf(ticket.ticketId);
            if (index !== -1) {
                seller_wallet.splice(index, 1);
            } else {
                console.log('Ticket is NOT in Wallet');
            return;
            };
  
    // Buyer
    buyer.accountBalance -= salePrice
    
    if (buyer.wallet == null) {
            buyer.wallet = [];
    }
    buyer.wallet.push(ticket.ticketId);
  
    // Flight  
    // Add resell percentage (set in contract)
    flight.accountBalance += (toAirline);
  
    // Ticket
    // ticket.pnr = buyer.email;  
    ticket.pnr = factory.newRelationship(NS, 'Passenger', buyer.email);
    ticket.purchasePrice = salePrice;
  
    return getParticipantRegistry('org.acme.airline1.Flight')
  
        .then(function (flightRegistry) {
            return flightRegistry.update(flight);  
        })
  
    	.then(function() {
         	return getParticipantRegistry('org.acme.airline1.Passenger')
         })
  
            .then(function (passengerRegistry) {
                return passengerRegistry.updateAll([buyer, seller]);  
            })

                .then(function() {
                    return getAssetRegistry('org.acme.airline1.Ticket')
                })

                    .then(function (ticketRegistry) {
                        return ticketRegistry.update(ticket);  
                    });  

}
// ****** END of SellTicket

   /**
   * A Passenger sells ticket back to airline
   * @param {org.acme.airline1.A25_BackToAirline} backToAirline -
   * @transaction
   */
function A25_BackToAirline(backToAirline) {
    // free transfer for internal corporate
      
          console.log('Transfer Tix Back to Airline Function');
    
    var contract = backToAirline.ticket.flight.contract; 
    var flight = backToAirline.ticket.flight;
    var ticket = backToAirline.ticket;
   
    var penaltyBuyBack = contract.penaltyBuyBack; 	// % of tix price to airline
    // var percentResale = contract.percentResale; 	// % of resale price to airline
    var premiumSeats = contract.premiumRemainingSeats; // may adjust based on seats remain
    var premiumDays = contract.premiumRemainingDays;   // may adjust based on days to flight
  
    var orgPrice = ticket.purchasePrice; 
 
    var passenger = ticket.pnr;
    var seller_bal = ticket.pnr.accountBalance; 
    var flight_bal = flight.accountBalance; // accountBalance
    var wallet = passenger.wallet;
 
  
  // *** In Passenger
  // remove (splice) from wallet
  // sell tix, add money to accountBalance
  
  // *** In FLight
  // pay for tix, remove money to account balance
  
  // calculate % to stakeholders
  // use percent once, so only a single rounding error
  //  ***  penalty goes to airline
  // tix price - penalty goes to passenger
    var penalty = orgPrice * penaltyBuyBack;
    var toPassenger = orgPrice - penalty;
    // var fromAirline = orgPrice - penalty;

    passenger.accountBalance += (toPassenger);
    flight.accountBalance -= (toPassenger);
  
  // remove ticket from passenger wallet
  	var index = wallet.indexOf(ticket.ticketId);
        if (index !== -1) {
              wallet.splice(index, 1);
        };
  
  // *** In ticket
  // change status to "AVAIL" 
  // remove pnr, would like to delete, not just blank
  // get original purchasePrice
  
    ticket.status = 'AVAIL';
    ticket.pnr = null;
  

    return getParticipantRegistry('org.acme.airline1.Flight')
  
        .then(function (flightRegistry) {
            return flightRegistry.update(flight);  
        })
  
    	.then(function() {
         	return getParticipantRegistry('org.acme.airline1.Passenger')
         })
  
            .then(function (passengerRegistry) {
                return passengerRegistry.update(passenger);  
            })

                .then(function() {
                    return getAssetRegistry('org.acme.airline1.Ticket')
                })

                    .then(function (ticketRegistry) {
                        return ticketRegistry.update(ticket);  
                    });  
}
// ****** END of BackToAirline


   /**
   * A Passenger buy a ticket
   * @param {org.acme.airline1.A23_TransferTicket} transferTicket -
   * @transaction
   */
function A23_TransferTicket(transferTicket) {
    // free transfer for internal corporate
      
          console.log('Transfer Ticket Function');
    
    var flight = transferTicket.ticket.flight;
    var ticket = transferTicket.ticket;
    // var sellerType = transferTicket.sellerType;
    // var buyerType = transferTicket.buyerType; 
    var seller_id;
    var buyer_id;
    var buyer; // = transferTicket.newBuyer; 
    var pnr = transferTicket.ticket.pnr;
    		
       if (pnr != null) {
            // later check if user has right to transfer
            seller_id = pnr.email;
            buyer_id = transferTicket.newOwner.email;
       }
      else {
            console.log("This ticket is NOT owned");
            return; 
       }

        return getParticipantRegistry('org.acme.airline1.Passenger')
         // Get the specific passenger from  participant registry.
            .then(function (passengerRegistry) {
          	    return passengerRegistry.get(buyer_id); 
            })
    
                .then(function (buyerReturn) {
                    // Process the the buyer object.
                    buyer = buyerReturn; 
                    // change pnr on ticket
                    ticket.pnr = buyer;
                      // Adding ticket to the Passengers wallet       
                      if (buyer.wallet == null) {
                          buyer.wallet = [];
                      }
                      buyer.wallet.push(ticket.ticketId);
          
                    return getAssetRegistry('org.acme.airline1.Ticket')
                        .then(function (ticketRegistry) {
                            // persist the state of the commodity
                            return ticketRegistry.update(ticket)
      
                    .then(function () {
                      return getParticipantRegistry('org.acme.airline1.Passenger');
                    })
       					.then(function (passengerRegistry) {
                        // update the flight's balance
                        return passengerRegistry.get(seller_id);
                        })
                            .then(function (sellerReturn)  {
                                // do something with seller
                                arrayLen = sellerReturn.wallet.length;
                                for (i = 0; i < arrayLen; i++) {
                                  if (sellerReturn.wallet[i] == ticket.ticketId) { 
                                    sellerReturn.wallet.splice(i, 1);
                                  }
                                }
                                return getParticipantRegistry('org.acme.airline1.Passenger')
                                .then(function (passengerRegistry) {
                                   return passengerRegistry.updateAll([sellerReturn, buyer]);
                                });
                            });         
          	    })
     
        })
}
// ****** END of TransferTicket



/**
 * A Passenger buy a ticket
 * @param {org.acme.airline1.A11_BuyDirect} buyDirect - the Purchase transaction
 * @transaction
 */
function A11_BuyDirect(buyDirect) {
// function BuyDirect(transaction) {
      
    console.log('Buy Direct Function');

    var buyer; 
    var buyer_id;
    var factory = getFactory();
    var NS = 'org.acme.airline1';
    /*
    ONLY when abstracting purchaser to passenger & corp
    var NSpurchaser //namespace depending on purchaser type
    var registryType 
    NSpurchaser = 'org.acme.airline1.Passenger'
    registryType = 'passengerRegistry';
    */
        
    var contract = buyDirect.ticket.flight.contract; 
    var flight = buyDirect.ticket.flight;
    var ticket = buyDirect.ticket;
    var premiumSeats = contract.premiumRemainingSeats; 
    var premiumDays = contract.premiumRemainingDays; 
    
    var classType = ticket.classType; 
    var status = ticket.status; 
    var quantity = 1; 
    
    var basePrice
    var buyPrice 
         
    // make sure ticket is still available for saale
    if (status == 'AVAIL') {
            console.log('This ticket is: ' + status); 
        } 
            else
        {
            // document.write('This Ticket has already been ' + status);
            console.log('This Ticket has already been ' + status);
            return;
    }

    if (classType == 'ECONOMY') {
            basePrice = flight.basePriceEconomy;
        } else if (classType == 'BUSINESS') {
            basePrice = flight.basePriceBusiness;
        } else {
            basePrice = flight.basePriceBusiness; // will be first
    }
    
    	
    		
    // Adjust for Premium (seats or days remianing)
        console.log('Flight Date in db' + flight.dateDepart);
    var now = new Date;
    var flightDate = new Date(flight.dateDepart);
        console.log('Date Now: ' + now);
        console.log('Date Flight: ' + flightDate);
    var daysToFLight; 

            if (now < flightDate) {
                //  document.write('myDate is in the future');
                console.log('myDate is in the future');
                daysToFLight = (flightDate - now)/(24*60*60*1000);
               	if (daysToFLight < premiumDays) {
                  // Days to FLight adjustment
                  // Charge Premium: (flight is close to threshold
              		buyPrice = basePrice * contract.premiumMultiplier
                    }
                    else
                    {
                    // No Days adjustment
                        buyPrice = basePrice 
            	    }
                }
                else
                {
                console.log('The FLight is NOT in the future');
            }
    			console.log('Days to FLight: ' + daysToFLight);
    
       			console.log('Buy Price: ' + buyPrice);

    //  var buyer_old = buyDirect.passenger.email; 
    var seller = flight.travelId;
    var totalPrice = buyPrice * quantity; 
    
          // *************************
    	  // Get & Process the buyer (passenger)
          // from: https://hyperledger.github.io/composer/jsdoc/module-composer-runtime.ParticipantRegistry.html
          // Fromn the passenger participant registry.
          //  
    		// determine and set purchaser type
    	    if (buyDirect.buyerType == 'CORP') {
               buyer_id = corporate_id; 
            } else if (buyDirect.buyerType == 'PERSONAL') {
               buyer_id = passenger_id;
            } else {
               buyer_id = passenger_id; // will be AGENT
            }
    		
    	
            return getParticipantRegistry('org.acme.airline1.Passenger')
            // Get the specific passenger from  participant registry.
            .then(function (passengerRegistry) {
                return passengerRegistry.get(buyer_id); 
            })
    
                .then(function (buyerReturn) {
                // Process the the buyer object.
                buyer = buyerReturn; 
                
                // buyDirect.passenger.accountBalance -= totalPrice;
                buyer.accountBalance -= totalPrice;
                flight.accountBalance += totalPrice;
            
                    console.log('buyer test balance: ' + buyer.accountBalance);
                    console.log('Flight: ' + seller + ' new balance: ' + flight.accountBalance);
            
            
                // Adding ticket to the Passengers wallet  
                // may need to pull from registry and count, also check if already purchased
                if (buyer.wallet == null) {
                    buyer.wallet = [];
                }
                buyer.wallet.push(ticket.ticketId);
                
                // add passenger to ticket 
                ticket.pnr = factory.newRelationship(NS, 'Passenger', buyer.email);
              	ticket.purchasePrice = buyPrice;
                ticket.status = "SOLD";
                    
                // Now UPDATE the registry's
                return getParticipantRegistry(NS + '.Passenger')
                // Get the specific passenger from  participant registry.
                    .then(function (passengerRegistry) {
                        return passengerRegistry.update(buyer); 
                    })
    /*
          return getParticipantRegistry('org.acme.airline1.Passenger')
          .then(function (passengerRegistry) {
              // update the buyers's balance & ticket
              return passengerRegistry.update(buyer);
          })
    */      
        .then(function () {
              return getParticipantRegistry('org.acme.airline1.Flight');
            })
            .then(function (flightRegistry) {
                // update the flight's balance
                return flightRegistry.update(flight);
                })
                    .then(function () {
                    return getAssetRegistry('org.acme.airline1.Ticket');
                    })
                        .then(function (ticketRegistry) {
                            // update the ticket
                            return ticketRegistry.update(ticket);    
                        });
                  
        })
    	
        .catch(function (error) {
          // Add optional error handling here.
         console.log(error);
        });
        
}   
  
  
  
  
  /**
   * Initialize some test assets and participants useful for running a demo.
   * @param {org.acme.airline1.A01_SetupDemo} setupDemo - the SetupDemo transaction
   * @transaction
   */
  function A01_SetupDemo(setupDemo) {
  
      // The factory (getFactory) can be used to create new instances of assets, 
      // participants, and transactions for storing in registries.
      var factory = getFactory();
      var NS = 'org.acme.airline1';
  
      /* changed to participant ***
      // create the flights
      var flight = factory.newResource(NS, 'Flight', 'DLT123');
      var fltFirst = factory.newResource(NS, 'FlightClass', 'DLT123_First');
      fltFirst.classType = 'FIRST'; 
      fltFirst.ticketsRemaining = 10;
      fltFirst.ticketPrice = 900;
      fltFirst.flight = flight;
      var fltBusiness = factory.newResource(NS, 'FlightClass', 'DLT123_Business');
      fltBusiness.classType = 'BUSINESS'; 
      fltBusiness.ticketsRemaining = 40;
      fltBusiness.ticketPrice = 500;
      fltBusiness.flight = flight; 
  
      // adds each class as an asset, referenced under flight
      // this method you can add as many classes under every flight
      // and seperate by price and quntity and ... price each class by quantity from a concept
      flight.flightClass = [fltFirst];
      flight.flightClass.push(fltBusiness);
      // *** ?? maybe make a concept, but not sure if we can change price and quantity ??
      // with concept you can read easier
      */

      /*
      // create the flights
      var fltBusiness = factory.newResource(NS, 'FlightFirst', 'DLT123');
      fltBusiness.ticketsRemaining = 40;
      fltBusiness.ticketPrice = 500;
      */
  
      // create the airline
      var airline = factory.newResource(NS, 'Airline', 'delta@email.com');
      var airlineAddress = factory.newConcept(NS, 'Address');
      airlineAddress.country = 'USA';
      airline.address = airlineAddress;
      airline.accountBalance = 0;

       // create the flight (participant so to track tickets)
       var flight1 = factory.newResource(NS, 'Flight', 'DLT111_2018_11_01');
       flight1.flightNumber = 'DLT111';
       flight1.dateDepart = '2018-11-01'; //Thh:mm:ss
       flight1.accountBalance = 0;
       flight1.basePriceEconomy = 100.0; 
       flight1.basePriceBusiness = 300.0; 
       flight1.contract = factory.newRelationship(NS, 'Contract_100', 'CON_101');
    
       var flight2 = factory.newResource(NS, 'Flight', 'DLT222_2018_12_01');
       flight2.flightNumber = 'DLT222';
       flight2.dateDepart = '2018-12-01';
       flight2.accountBalance = 0;
       flight2.basePriceEconomy = 100.0; 
       flight2.basePriceBusiness = 300.0; 
       flight2.contract = factory.newRelationship(NS, 'Contract_100', 'CON_101');
   
       var flight3 = factory.newResource(NS, 'Flight', 'DLT111_2018_12_01');
       flight3.flightNumber = 'DLT111';
       flight3.dateDepart = '2018-12-01';
       flight3.accountBalance = 0;
       flight3.basePriceEconomy = 100.0; 
       flight3.basePriceBusiness = 300.0; 
       flight3.contract = factory.newRelationship(NS, 'Contract_100', 'CON_101');
   
  
      // create the passenger
      var passenger1 = factory.newResource(NS, 'Passenger', 'eric');//@email.com');
      var passengerAddress = factory.newConcept(NS, 'Address');
      passengerAddress.country = 'USA';
      passenger1.passengerType = 'PERSONAL';
      passenger1.address = passengerAddress;
      passenger1.accountBalance = 1000;
    
          // create the passenger
      var passenger2 = factory.newResource(NS, 'Passenger', 'john');//@email.com');
      var passengerAddress = factory.newConcept(NS, 'Address');
      passengerAddress.country = 'United Kingdom';
      passenger2.passengerType = 'PERSONAL';
      passenger2.address = passengerAddress;
      passenger2.accountBalance = 1000;
  
          // create the corporatoin
      var corporation1 = factory.newResource(NS, 'Passenger', 'corp');//@email.com');
      var corporateAddress = factory.newConcept(NS, 'Address');
      corporateAddress.country = 'USA';
      corporation1.passengerType = 'CORP';
      corporation1.address = corporateAddress;
      corporation1.accountBalance = 1000;
  
      var contract = factory.newResource(NS, 'Contract_100', 'CON_101');
      // contract.airline = factory.newRelationship(NS, 'Airline', 'delta@email.com');
      // contract.flight = factory.newRelationship(NS, 'Flight', 'DLT111_2018_04_01');
      // contract.passenger = factory.newRelationship(NS, 'Passenger', 'eric@email.com')
      // contract.ticket = factory.newRelationship(NS, 'Ticket', 'SEAT_A1');
      // var tomorrow = setupDemo.timestamp;
      // tomorrow.setDate(tomorrow.getDate() + 1);
      // contract.purchaseDateTime = tomorrow; 
      // contract.basePriceEconomy = 100.0; // base $100  per ticket
      // contract.basePriceBusiness = 300.0; 
      contract.premiumRemainingSeats = 1;  // anything =< will chanrge more for ticket
      contract.premiumRemainingDays = 30;  // anything =< will chanrge more for ticket
      contract.premiumMultiplier = 2.5; // how much more we chanrge for ticket
      contract.penaltyBuyBack = 0.50; 
      contract.penaltyTransfer = 0.10; 
      contract.percentResale = 0.30;
     


      
       // create the ticket
       var ticket = factory.newResource(NS, 'Ticket', 'E1');
       ticket.classType = 'ECONOMY';
       ticket.status = 'AVAIL';
      // ticket.contract = factory.newRelationship(NS, 'Contract', 'CON_001');
       ticket.flight = factory.newRelationship(NS, 'Flight', 'DLT111_2018_11_01');
    
   
//*********************************
// 		Add to Registry
//*********************************
  
    return getParticipantRegistry(NS + '.Airline')
        .then(function (airlineRegistry) {
            // add the airline
            return airlineRegistry.addAll([airline]);
        })
    
        .then(function() {
            return getParticipantRegistry(NS + '.Passenger');
        })
            .then(function(passengerRegistry) {
                // add the passengers
                return passengerRegistry.addAll([passenger1, passenger2, corporation1]);
            })
    /*		ONLY if we abstract Purchaser to passenger & corp
        .then(function() {
              return getParticipantRegistry(NS + '.Corporation');
        })
            .then(function(corporationRegistry) {
                // add the passengers
                return corporationRegistry.addAll([corporation1]);
            })
    */   
        .then(function() {
                return getAssetRegistry(NS + '.Ticket');
        })
            .then(function(ticketRegistry) {
                // add the tickets
                return ticketRegistry.addAll([ticket]);
            })
    
        .then(function() {
                return getParticipantRegistry(NS + '.Flight');
            })
            .then(function(flightRegistry) {
                // add the flights
                return flightRegistry.addAll([flight1, flight2, flight3]);
            })
    
            
        .then(function() {
            return getAssetRegistry(NS + '.Contract_100');
            })
            .then(function(contractRegistry) {
                // add the contracts
                return contractRegistry.addAll([contract]);
            });
        

}

// *************************
// Tested or Old - NOT using
function updateTicket(ticket) {
    // ********* Does NOT work outside of Promise ????? - does not pause
     return getAssetRegistry('org.acme.airline1.Ticket')
                  .then(function (ticketRegistry) {
          console.log('22222222');
       
                      // emit a notification that a trade has occurred
                      // var tradeNotification = getFactory().newEvent('org.acme.trading', 'TradeNotification');
                      //tradeNotification.commodity = trade.commodity;
                      //emit(tradeNotification);
  
                      // persist the state of the commodity
                      return ticketRegistry.update(ticket);
                  });
}

  
  /* 
    	// who owns ticket (testing assume Corp)
    	// determine and set purchaser type
        if (buyerType == 'CORP') {
            buyer_id = corporate_id; 
            seller_id = passenger_id; 
        } else if (buyerType == 'PERSONAL') {
            buyer_id = passenger_id;
            seller_id = corporate_id; 
        } else {
            buyer_id = passenger_id; // will be AGENT
            seller_id = corporate_id; 
        }
   */


/*
Index of
function remove(array, element) {
    const index = array.indexOf(element);
    
    if (index !== -1) {
        array.splice(index, 1);
    }
}

*/
  