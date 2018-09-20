import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { Ticket } from '../org.acme.airline1';
import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class TicketService {

	
		private NAMESPACE: string = 'Ticket';
	



    constructor(private dataService: DataService<Ticket>) {
    };

    public getAll(): Observable<Ticket[]> {
        return this.dataService.getAll(this.NAMESPACE);
    }

    public getAsset(id: any): Observable<Ticket> {
      return this.dataService.getSingle(this.NAMESPACE, id);
    }

    public addAsset(itemToAdd: any): Observable<Ticket> {
      return this.dataService.add(this.NAMESPACE, itemToAdd);
    }

    public updateAsset(id: any, itemToUpdate: any): Observable<Ticket> {
      return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
    }

    public deleteAsset(id: any): Observable<Ticket> {
      return this.dataService.delete(this.NAMESPACE, id);
    }

}
