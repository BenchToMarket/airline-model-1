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

// ********
// can we use ????? - vs promises
//   await assetRegistry.update(trade.commodity);


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
            sid = 'F' + i;
            newTicket = factory.newResource("org.acme.airline1", "Ticket", sid);
            newTicket.classType = 'First';
            newTicket.status = 'AVAIL';
            newTicket.flight = factory.newRelationship(NS, 'Flight', 'DLT111_2018_11_01');
            newTicket.bookingClass  = factory.newRelationship(NS, 'BookingClass', 'F');
            newTickets.push(newTicket); 
        }
        for (i = 2; i < 6; i++) {
            sid = 'E' + i;
            newTicket = factory.newResource("org.acme.airline1", "Ticket", sid);
            newTicket.classType = 'Economy';
            newTicket.status = 'AVAIL';
            newTicket.flight = factory.newRelationship(NS, 'Flight', 'DLT111_2018_11_01');
            newTicket.bookingClass  = factory.newRelationship(NS, 'BookingClass', 'Y');
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
    var sc_pricing = sellTicket.ticket.flight.sc_pricing; 
    var flight = sellTicket.ticket.flight;
    var ticket = sellTicket.ticket;
    var bookingClass = ticket.bookingClass;

    var allowTransaction = bookingClass.sc_change.canResell

    // Determine if allowed by Booking Class
    if (allowTransaction != true) {
        // if null or false
        console.log("Transaction is NOT allowed");
        return; 
    }
    else {
    // % of tix price to airline
    var percentResale = bookingClass.sc_change.percentResale 
    }
   
    // var percentResale = contract.percentResale; 	// % of resale price to airline
    // var premiumSeats = sc_pricing.premiumRemainingSeats; // may adjust based on seats remain
    // var premiumDays = sc_pricing.premiumRemainingDays;   // may adjust based on days to flight

    var adjustDaysLimit = sc_pricing.days;
    var premiumCapacity = sc_pricing.capacityOver;//premiumRemainingSeats; 
    var discountCapacity = sc_pricing.capacityUnder;
    var adjustPrices = true; //boolean based on days to departure 
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
  
    if (fLightOccupancy == 'Empty') {
           	priceMultiplier = 0.50;
        } else if (fLightOccupancy == 'Average') {
            priceMultiplier = 1.0;
        } else if (fLightOccupancy == 'Full') {
      		priceMultiplier = 1.50;
        } else if (fLightOccupancy == 'Oversold') {
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
  
    return getAssetRegistry('org.acme.airline1.Flight')
  
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
    
    var sc_pricing = backToAirline.ticket.flight.sc_pricing; 
    var flight = backToAirline.ticket.flight;
    var ticket = backToAirline.ticket;
    var bookingClass = ticket.bookingClass;

    var allowTransaction = bookingClass.sc_change.canReturn

    // Determine if allowed by Booking Class
    if (allowTransaction != true) {
        // if null or false
        console.log("Transaction is NOT allowed");
        return; 
    }
    else {
    // % of tix price to airline
    var penaltyReturn = bookingClass.sc_change.penaltyReturn; 
    }
   
    // var penaltyBuyBack = contract.penaltyBuyBack; 	// % of tix price to airline
    // var percentResale = contract.percentResale; 	// % of resale price to airline
    // var premiumSeats = sc_pricing.premiumRemainingSeats; // may adjust based on seats remain
    // var premiumDays = sc_pricing.premiumRemainingDays;   // may adjust based on days to flight

    var adjustDaysLimit = sc_pricing.days;
    var premiumCapacity = sc_pricing.capacityOver;//premiumRemainingSeats; 
    var discountCapacity = sc_pricing.capacityUnder;
    var adjustPrices = true; //boolean based on days to departure 
  
    var orgPrice = ticket.purchasePrice; 
 
    var passenger = ticket.pnr;
    var seller_bal = ticket.pnr.accountBalance; 
    var flight_bal = flight.accountBalance; // accountBalance
    var wallet = passenger.wallet;
    var quantity = 1;

  // *** In Passenger
  // remove (splice) from wallet
  // sell tix, add money to accountBalance
  
  // *** In FLight
  // pay for tix, remove money to account balance
  
  // calculate % to stakeholders
  // use percent once, so only a single rounding error
  //  ***  penalty goes to airline
  // tix price - penalty goes to passenger
    var penalty = orgPrice * penaltyReturn; // replaced - penaltyBuyBack;
    var toPassenger = orgPrice - penalty;
    // var fromAirline = orgPrice - penalty;

    passenger.accountBalance += (toPassenger);
    flight.accountBalance -= (toPassenger);
  
  // remove ticket from passenger wallet
  	var index = wallet.indexOf(ticket.ticketId);
        if (index !== -1) {
              wallet.splice(index, 1);
        };
  
    var classType = ticket.classType;   // need to change to reflect booking class   
    var matrix = flight.classPriceMatrix;
    if (classType == 'Economy') {
            matrix.classPriceEconomy.bcAvail += quantity;
        } else if (classType == 'Business') {
            matrix.classPriceFirst.bcAvail += quantity;
        } else {
            matrix.classPriceFirst.bcAvail += quantity;
    }
  // *** In ticket
  // change status to "AVAIL" 
  // remove pnr, would like to delete, not just blank
  // get original purchasePrice
  
    ticket.status = 'AVAIL';
    ticket.pnr = null;
  

    return getAssetRegistry('org.acme.airline1.Flight')
  
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
                    })

                    .then(function () {
                        return getAssetRegistry('org.acme.airline1.ClassPriceMatrix');
                        })
                            .then(function (classpriceRegistry) {
                                // update the avail
                                return classpriceRegistry.update(matrix);    
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
    var bookingClass = ticket.bookingClass;

    var allowTransaction = bookingClass.sc_change.canTransfer

    // Determine if allowed by Booking Class
    if (allowTransaction != true) {
        // if null or false
        console.log("Transaction is NOT allowed");
        return; 
    }
    else {
    // % of tix price to airline
    // need to replicate what we have in return
    var penaltyTransfer = bookingClass.sc_change.penaltyTransfer
    }

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
 * @param {org.acme.airline1.BuyDynamic} buyDynamic - the Purchase transaction
 * @transaction
 */
function BuyDynamic(buyDynamic) {
    // function to purchase and dynamically create ticket
    // receive: 
        // flight
        // bookingClass ID
        // if we receive flightID vs flight (refernece)
            // the cpm is only a refernce, not the entire resource 
    
    var factory = getFactory();
    var NS = 'org.acme.airline1';

    var flight; 
    var cpm;
    var bcAvail;
    var bcPrice; 
    var quantity = 1; 
    var seller;
    var totalPrice; 
    var buyer_id; 

    flight = buyDynamic.flight;
    cpm = flight.classPriceMatrix; 
    var sentTravelId = flight.travelId; 
    var sentBookingClassId = buyDynamic.bcId;

  
    if (sentBookingClassId == 'Y') {
     bcAvail = cpm.classPriceEconomy.bcAvail;
     bcPrice = cpm.classPriceEconomy.bcPrice; 
     totalPrice = bcPrice * quantity; 
         if (bcAvail >= quantity) {
             cpm.classPriceEconomy.bcAvail -= quantity;
             flight.accountBalance += totalPrice;
         }
         else  {
             console.log('Tickets NOT Available');
             return; 
         }
     }
     else if (sentBookingClassId == 'F') {
     bcAvail = cpm.classPriceFirst.bcAvail;
     bcPrice = cpm.classPriceFirst.bcPrice; 
     totalPrice = bcPrice * quantity; 
         if (bcAvail >= quantity) {
             cpm.classPriceFirst.bcAvail -= quantity;
             flight.accountBalance += totalPrice;
         }
         else  {
             console.log('Tickets NOT Available');
             return; 
         }
     }


    // determine ticketID
    // lets make it a confirmaiton number of the PSS ticket
    var newTicketId;
    newTicketId = "EFTXF6";
    newTicketId = (Math.random().toString(36).replace('0.', '')).substring(0,6).toUpperCase();

    // create the ticket
    var ticket = factory.newResource(NS, 'Ticket', newTicketId);

    // below 2 for Demo only, easier front-end
    // class defined in SC, status in PSS
    ticket.status = 'SOLD';   
    if (sentBookingClassId == 'Y') {
        ticket.classType = 'Economy';
        }
        else if (sentBookingClassId == 'F') {
        ticket.classType = 'First';
    }

    ticket.flight = factory.newRelationship(NS, 'Flight', sentTravelId); 
    ticket.bookingClass  = factory.newRelationship(NS, 'BookingClass', sentBookingClassId); 



        buyer_id = corporate_id; 

        return getParticipantRegistry(NS + '.Passenger')
        // Get the specific passenger from  participant registry.
        .then(function (passengerRegistry) {
            return passengerRegistry.get(buyer_id); 
        })

            .then(function (buyerReturn) {
                // Process the the buyer object.
                buyer = buyerReturn; 
                
                // buyDirect.passenger.accountBalance -= totalPrice;
                buyer.accountBalance -= totalPrice;
                // flight.accountBalance += totalPrice;
                      
                // Adding ticket to the Passengers wallet  
                // may need to pull from registry and count, also check if already purchased
                if (buyer.wallet == null) {
                    buyer.wallet = [];
                }
                buyer.wallet.push(newTicketId);
                
                // add passenger to ticket 
                // ticket.pnr = factory.newRelationship(NS, 'Passenger', buyer.email);
                // ticket.purchasePrice = buyPrice;
                // ticket.status = "SOLD";
                    

               return getAssetRegistry(NS + '.Ticket')
               .then(function (ticketRegistry) {
                   // update the ticket
                   return ticketRegistry.addAll([ticket]);    
               })
           
               /* */
                   .then(function() {
                       return getParticipantRegistry(NS + '.Passenger');
                   })
                       .then(function(passengerRegistry) {
                           return passengerRegistry.update(buyer);
                       })
             
                       .then(function() {
                           return getAssetRegistry(NS + '.Flight');
                       })
                           .then(function(flightRegistry) {
                               return flightRegistry.update(flight); 
                           })


            })    
}   
  

 
  

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
        
    var sc_pricing = buyDirect.ticket.flight.sc_pricing; 
    var flight = buyDirect.ticket.flight;
    var ticket = buyDirect.ticket;
    

    console.log('Flight: ' + flight);
    console.log('ticket: ' + ticket);


    var adjustDaysLimit = sc_pricing.days;
    var premiumCapacity = sc_pricing.capacityOver;//premiumRemainingSeats; 
    var discountCapacity = sc_pricing.capacityUnder;
    var adjustPrices = true; //boolean based on days to departure 
    // old ...var premiumDays = sc_pricing.premiumRemainingDays; 
    
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

    var matrix = flight.classPriceMatrix;

    if (classType == 'Economy') {
        // *** would not subtract purchase here
        // would wait until verified, but ok for Demo
            // basePrice = flight.basePriceEconomy;
            basePrice = flight.classPriceMatrix.classPriceEconomy.bcPrice;
            matrix.classPriceEconomy.bcAvail -= quantity;
        } else if (classType == 'Business') {
            // basePrice = flight.basePriceBusiness;
            basePrice = flight.classPriceMatrix.classPriceFirst.bcPrice;
            matrix.classPriceFirst.bcAvail -= quantity;
        } else {
            // basePrice = flight.basePriceBusiness; // will be first
            basePrice = flight.classPriceMatrix.classPriceFirst.bcPrice;
            matrix.classPriceFirst.bcAvail -= quantity;
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
               	if (daysToFLight < adjustDaysLimit) {
                  // Days to FLight adjustment
                  // Charge Premium: (flight is close to threshold
              		buyPrice = basePrice + (basePrice * sc_pricing.premium)
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
              return getAssetRegistry('org.acme.airline1.Flight');
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
                        })

                        .then(function () {
                            return getAssetRegistry(NS + '.ClassPriceMatrix');
                            })
                                .then(function (classpriceRegistry) {
                                    // update the avail
                                    return classpriceRegistry.update(matrix);    
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
  
    /*
      var classPriceJSON = {
        "F": {
            "bcName": "First",
            "bcPrice": 300,
            "bcIssue": 2,
            "bcAvail": 2,
            "bcCapacity": 1
        },
        "Y": {
            "bcName": "Economy",
            "bcPrice": 100,
            "bcIssue": 4,
            "bcAvail": 4,
            "bcCapacity": 1
        }
    }
    */

      // create the classPriceMartix 
      var cpm_dlt1 = factory.newResource(NS, 'ClassPriceMatrix', 'cpm_DLT111_2018_11_01');
      var cpm_dlt2 = factory.newResource(NS, 'ClassPriceMatrix', 'cpm_DLT222_2018_12_01');
      var cpm_dlt3 = factory.newResource(NS, 'ClassPriceMatrix', 'cpm_DLT111_2018_12_01');

      // assigning the same pricing structre for each flight for simplicity
      // this can vary by flight, but can have a few to choose from and assign
      
      var cp1 = factory.newConcept(NS, 'ClassPrice');
      cp1.bcId = "F";
      cp1.bcName = "First";
      cp1.bcBase = 300;
      cp1.bcPrice = 300;
      cp1.bcIssue = 2;
      cp1.bcAvail = 2;
      cp1.bcCapacity = 1;
      
      var cp2 = factory.newConcept(NS, 'ClassPrice');
      cp2.bcId = "Y";
      cp2.bcName = "Economy";
      cp2.bcBase = 100;
      cp2.bcPrice = 100;
      cp2.bcIssue = 4;
      cp2.bcAvail = 4;
      cp2.bcCapacity = 1;

      cpm_dlt1.classPriceFirst = cp1;
      cpm_dlt1.classPriceEconomy = cp2;
      cpm_dlt2.classPriceFirst = cp1;
      cpm_dlt2.classPriceEconomy = cp2;

        // change avail for flight 3
        var cp1_3 = factory.newConcept(NS, 'ClassPrice');
        cp1_3.bcId = "F";
        cp1_3.bcName = "First";
        cp1_3.bcBase = 600;
        cp1_3.bcPrice = 600;
        cp1_3.bcIssue = 2;
        cp1_3.bcAvail = 1;
        cp1_3.bcCapacity = 5;
        
        var cp2_3 = factory.newConcept(NS, 'ClassPrice');
        cp2_3.bcId = "Y";
        cp2_3.bcName = "Economy";
        cp2_3.bcBase = 200;
        cp2_3.bcPrice = 200;
        cp2_3.bcIssue = 4;
        cp2_3.bcAvail = 1;
        cp2_3.bcCapacity = 9;  //higher number more full

      cpm_dlt3.classPriceFirst = cp1_3;
      cpm_dlt3.classPriceEconomy = cp2_3;
      

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
       flight1.segment = 'SFO to ATL';
       flight1.accountBalance = 0;
       flight1.basePriceEconomy = 100.0; 
       flight1.basePriceBusiness = 300.0; 
       flight1.sc_pricing = factory.newRelationship(NS, 'SC_Pricing', 'sc_pricing_10');
       flight1.classPriceMatrix = factory.newRelationship(NS, 'ClassPriceMatrix', 'cpm_DLT111_2018_11_01');
    
       var flight2 = factory.newResource(NS, 'Flight', 'DLT222_2018_12_01');
       flight2.flightNumber = 'DLT222';
       flight2.dateDepart = '2018-12-01';
       flight2.segment = 'SFO to JFK';
       flight2.accountBalance = 0;
       flight2.basePriceEconomy = 100.0; 
       flight2.basePriceBusiness = 300.0; 
       flight2.sc_pricing = factory.newRelationship(NS, 'SC_Pricing', 'sc_pricing_10');
       flight2.classPriceMatrix = factory.newRelationship(NS, 'ClassPriceMatrix', 'cpm_DLT222_2018_12_01');
    
       var flight3 = factory.newResource(NS, 'Flight', 'DLT111_2018_12_01');
       flight3.flightNumber = 'DLT111';
       flight3.dateDepart = '2018-12-01';
       flight3.segment = 'SFO to ATL';
       flight3.accountBalance = 0;
       flight3.basePriceEconomy = 100.0; 
       flight3.basePriceBusiness = 300.0; 
       flight3.sc_pricing = factory.newRelationship(NS, 'SC_Pricing', 'sc_pricing_30');
       flight3.classPriceMatrix = factory.newRelationship(NS, 'ClassPriceMatrix', 'cpm_DLT111_2018_12_01');
    
   
  
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
  
      var sc_pricing_10 = factory.newResource(NS, 'SC_Pricing', 'sc_pricing_10');
      sc_pricing_10.days = 10;
      sc_pricing_10.capacityUnder = 2;  // Discount if bcCapacity is =< (less)
      sc_pricing_10.capacityOver = 7;   //Premium if bcCapacity is >= (greater)
      sc_pricing_10.premium = 1.0; // 1.0 is 100%
      sc_pricing_10.discount = 0.50;

      var sc_pricing_30 = factory.newResource(NS, 'SC_Pricing', 'sc_pricing_30');
      sc_pricing_30.days = 30;
      sc_pricing_30.capacityUnder = 1;
      sc_pricing_30.capacityOver = 8;
      sc_pricing_30.premium = 0.50; 
      sc_pricing_30.discount = 0.25;

      // sc_pricing.premiumRemainingSeats = 1;  // anything =< will chanrge more for ticket
      // sc_pricing.premiumRemainingDays = 30;  // anything =< will chanrge more for ticket
      // sc_pricing.premiumMultiplier = 2.5; // how much more we chanrge for ticket
      // sc_pricing.penaltyBuyBack = 0.50; 
      // sc_pricing.penaltyTransfer = 0.10; 
      // sc_pricing.percentResale = 0.30;
     
      // *** Change Contracts
      var sc_change_50 = factory.newResource(NS, 'SC_Change', 'sc_change_50');
      // 50 - defineds 50% return pentalty 
      sc_change_50.canReturn = false;
      sc_change_50.canResell = true;
      sc_change_50.canTransfer = true;
      sc_change_50.canChangeDate = true;
      sc_change_50.canChangeTime = true;

      sc_change_50.penaltyReturn = 0.50; 
      sc_change_50.percentResale = 0.30;
      sc_change_50.penaltyTransfer = 0.10;
      sc_change_50.changeDate = 0.30;
      sc_change_50.changeTime = 0.10;

      var sc_change_NO = factory.newResource(NS, 'SC_Change', 'sc_change_NO');
      // 50 - defineds 50% return pentalty 
      sc_change_NO.canReturn = true;
      sc_change_NO.canResell = false;
      sc_change_NO.canTransfer = false;
      sc_change_NO.canChangeDate = false;
      sc_change_NO.canChangeTime = false;
      sc_change_NO.penaltyReturn = 0.70; 
      sc_change_NO.percentResale = 0;
      sc_change_NO.penaltyTransfer = 0;
      sc_change_NO.changeDate = 0;
      sc_change_NO.changeTime = 0;

      var sc_change_0 = factory.newResource(NS, 'SC_Change', 'sc_change_0');
      // 50 - defineds 50% return pentalty 
      sc_change_0.canReturn = true;
      sc_change_0.canResell = true;
      sc_change_0.canTransfer = true;
      sc_change_0.canChangeDate = true;
      sc_change_0.canChangeTime = true;

      sc_change_0.penaltyReturn = 0; 
      sc_change_0.percentResale = 0.20;
      sc_change_0.penaltyTransfer = 0;
      sc_change_0.changeDate = 0;
      sc_change_0.changeTime = 0;


      
       // create the ticket
       var ticket = factory.newResource(NS, 'Ticket', 'E1');
       ticket.classType = 'Economy';
       ticket.status = 'AVAIL';
        // ticket.contract = factory.newRelationship(NS, 'Contract', 'CON_001');
       ticket.flight = factory.newRelationship(NS, 'Flight', 'DLT111_2018_11_01');
       ticket.bookingClass  = factory.newRelationship(NS, 'BookingClass', 'Y');

        // create the booking classes
       var bc_first = factory.newResource(NS, 'BookingClass', 'F');
       bc_first.bcName = 'First';  // sub-cat of classType, this can be first discounted, 
       bc_first.classType = 'First';  
       bc_first.sc_change  = factory.newRelationship(NS, 'SC_Change', 'sc_change_0');

        var bc_economy = factory.newResource(NS, 'BookingClass', 'Y');
        bc_economy.bcName = 'Economy';  // sub-cat of classType, this can be first discounted, 
        bc_economy.classType = 'Economy';  
        bc_economy.sc_change  = factory.newRelationship(NS, 'SC_Change', 'sc_change_50');
  
    
   
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
                return getAssetRegistry(NS + '.Flight');
        })
            .then(function(flightRegistry) {
                // add the flights
                return flightRegistry.addAll([flight1, flight2, flight3]);
            })


        .then(function() {
                return getAssetRegistry(NS + '.BookingClass');
        })
            .then(function(bookingclassRegistry) {
                // add the tickets
                return bookingclassRegistry.addAll([bc_first, bc_economy]);
            })
        
        .then(function() {
                return getAssetRegistry(NS + '.ClassPriceMatrix');
        })
            .then(function(classpriceRegistry) {
                // add the tickets
                return classpriceRegistry.addAll([cpm_dlt1, cpm_dlt2, cpm_dlt3]);
            })


    
        // *** not sure why we can't have all contracts in same Registry ??    
        .then(function() {
            return getAssetRegistry(NS + '.SC_Pricing');
            })
            .then(function(contractRegistry) {
                // add the contracts
                return contractRegistry.addAll([sc_pricing_10, sc_pricing_30]);
            })

            
        .then(function() {
            return getAssetRegistry(NS + '.SC_Change');
            })
            .then(function(sc_changeRegistry) {
                // add the contracts
                return sc_changeRegistry.addAll([sc_change_50, sc_change_0, sc_change_NO]);
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
  