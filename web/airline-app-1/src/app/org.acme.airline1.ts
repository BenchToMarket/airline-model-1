import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';

/* 
Structure of WebApp Code:
    main modules:
        org.airline1.ts             defines Assets
        data.services.ts            populates Assets
        app.modules.ts
        app-routing.modules.ts
        app.component.html          display

    Asset modules:
        Passenger.service.ts        requests data
        Passenger.component.ts      gets & organizes data
        Passenger.component.html    display / update

*/

// export namespace org.acme.airline1{
   export enum ClassType {
      FIRST,
      BUSINESS,
      ECONOMY,
   }
   export enum TicketStatus {
      AVAIL,
      RESERVED,
      SOLD,
   }
   export enum EntityType {
      CORP,
      PERSONAL,
      AGENT,
   }
   export enum FLightOccupancy {
      EMPTY,
      AVERAGE,
      FULL,
      OVERSOLD,
   }
   export class Address {
      city: string;
      country: string;
      street: string;
      zip: string;
   }
   export class Ticket extends Asset {
      ticketId: string;
      classType: ClassType;
      status: TicketStatus;
      purchasePrice: number;
      purchaseDate: string;
      flight: Flight;
      pnr: Passenger;
   }
   export class Reservation {
      seat: string;
      meal: string;
      holdLuggage: boolean;
   }
   export abstract class Contract extends Asset {
      contractId: string;
   }
   export class Contract_100 extends Contract {
      premiumRemainingSeats: number;
      premiumRemainingDays: number;
      premiumMultiplier: number;
      penaltyBuyBack: number;
      percentResale: number;
   }
   export abstract class Seller extends Participant {
      email: string;
      address: Address;
      accountBalance: number;
   }
   export class Airline extends Seller {
   }
   export class Passenger extends Participant {
      email: string;
      passengerType: EntityType;
      address: Address;
      accountBalance: number;
      wallet: string[];
   }
   export abstract class Travel extends Participant {
      travelId: string;
      accountBalance: number;
   }
   export class Flight extends Travel {
      flightNumber: string;
      dateDepart: string;
      basePriceEconomy: number;
      basePriceBusiness: number;
      contract: Contract_100;
   }
   export abstract class BuyTransaction extends Transaction {
      ticket: Ticket;
   }
   export class BuyDirect extends BuyTransaction {
      buyerType: EntityType;
   }
   export abstract class TransferTix extends Transaction {
      ticket: Ticket;
   }
   export class TransferTicket extends TransferTix {
      newOwner: Passenger;
   }
   export class BackToAirline extends TransferTix {
   }
   export class SellTicket extends TransferTix {
      fLightOccupancy: FLightOccupancy;
      newOwner: Passenger;
   }
   export class IssueTickets extends Transaction {
   }
   export class SetupDemo extends Transaction {
   }
// }
