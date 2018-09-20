import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { Configuration }     from './configuration';
import { DataService }     from './data.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
// import { TransactionComponent } from './Transaction/Transaction.component'

import { TicketComponent } from './Ticket/Ticket.component';
import { Contract_100Component } from './Contract_100/Contract_100.component';
import { PassengerComponent } from './Passenger/Passenger.component';
import { FlightComponent } from './Flight/Flight.component';
import { ParticipantComponent } from './Participant/Participant.component';

@NgModule({
  declarations: [
    AppComponent,
		HomeComponent,
    // TransactionComponent,

    ParticipantComponent,

    PassengerComponent,

    FlightComponent,

    TicketComponent,
		
    Contract_100Component
		
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    Configuration,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
