import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';

import { Flight } from '../org.acme.airline1';
import 'rxjs/Rx';


// Can be injected into a constructor
@Injectable()
export class FlightService {

	
		private NAMESPACE: string = 'Flight';
	



    constructor(private dataService: DataService<Flight>) {
    };

    public getAll(): Observable<Flight[]> {
        return this.dataService.getAll(this.NAMESPACE);
    }

    public getAsset(id: any): Observable<Flight> {
      return this.dataService.getSingle(this.NAMESPACE, id);
    }

    public addAsset(itemToAdd: any): Observable<Flight> {
      return this.dataService.add(this.NAMESPACE, itemToAdd);
    }

    public updateAsset(id: any, itemToUpdate: any): Observable<Flight> {
      return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
    }

    public deleteAsset(id: any): Observable<Flight> {
      return this.dataService.delete(this.NAMESPACE, id);
    }

}
