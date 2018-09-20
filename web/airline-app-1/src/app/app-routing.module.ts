import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { TransactionComponent } from './Transaction/Transaction.component'
import { HomeComponent } from './home/home.component';

import { TicketComponent } from './Ticket/Ticket.component';
import { Contract_100Component } from './Contract_100/Contract_100.component';
import { PassengerComponent } from './Passenger/Passenger.component';
import { FlightComponent } from './Flight/Flight.component';
import { ParticipantComponent } from './Participant/Participant.component';

const routes: Routes = [
    // { path: 'transaction', component: TransactionComponent },
    {path: '', component: HomeComponent},

    { path: 'Passenger', component: PassengerComponent},

    { path: 'Flight', component: FlightComponent},
		
		{ path: 'Ticket', component: TicketComponent},
		
    { path: 'Contract_100', component: Contract_100Component},
    
    { path: 'Participant', component: ParticipantComponent},
		
		{path: '**', redirectTo:''}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
