# Bearer Asset - Airline Ticket

> Proof of Concept for Airline tickets as non-fungible assets.

Designed for Corporations to buy tickets in bulk, in advance, without placing any passenger details on the ticket. This allows the corporation to seamlessly assign or change employee to ticket up to the "Day of Travel". The corporation can also change dates, times or segments as well as return without any needed involvement from the Airline. Any ticket may be transfered between employees or later sold on a P2P marketplace.

The transfer, return or resale terms are defined in the smart contracts attached to the blockchain fligth or ticket. The terms include allowance of any transfer, return or resale. The terms also include any penalty which will be automatically (by smart contract) disrtibuted back to the airline. All terms and panalty are set by the airline.

In this Proof of Concept we can:
 - Create Flights
 - Create Tickets for each flight
 - Create & Assign Modular Smart Contracts 
 - List available tickets & prices
 - Set prices Dynamically
 - Purchase Tickets
 - Create ticket dynamically to sync Airline inventory
 - Assign ticket to a Digital Wallet
 - Transfer ticket
 - Return Ticket (w/ penalty going to airline)
 - Resell ticket (w/ penalty going to airline)

This business network defines:

**Participants**
`Airline` `Passenger` `Corporation`

**Assets**
`Flight` `Ticket`
Tickets belong to a specific flight

**Smart COntracts**
Assigned to FLight, Ticket or BookingClass
`BookingClass`  - to Ticket
`SC_Pricing`    - to FLight, controls dynamic pricing based capacity
`SC_Change`     - to BookingClass, controls transfer & penalty


**Transactions**
`SetupDemo`       - populates basic assets, SC
`BuyDynamic`      - MVP for Airlines, create tix AFTER sold
`TransferTix`     - from one entity to another
                  - may be xFer, resell or return

`IssueTickets`     - Issues a set of test tickets




To test this Business Network Definition in the **Test** tab:

Submit a `SetupDemo` transaction:

```
{
  "$class": "org.acme.shipping.perishable.SetupDemo"
}
```

This transaction populates the Participant Registries with a `Grower`, an `Importer` and a `Shipper`. The Asset Registries will have a `Contract` asset and a `Shipment` asset.

Submit a `TemperatureReading` transaction:

```
{
  "$class": "org.acme.shipping.perishable.TemperatureReading",
  "centigrade": 8,
  "shipment": "resource:org.acme.shipping.perishable.Shipment#SHIP_001"
}
```

Congratulations!
