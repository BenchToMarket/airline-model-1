import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { Passenger } from '../org.acme.airline1';

import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class PassengerService {

	
		private NAMESPACE: string = 'Passenger';
	



    constructor(private dataService: DataService<Passenger>) {
    };

    public getAll(): Observable<Passenger[]> {
        return this.dataService.getAll(this.NAMESPACE);
    }

    public getAsset(id: any): Observable<Passenger> {
      return this.dataService.getSingle(this.NAMESPACE, id);
    }

    public addAsset(itemToAdd: any): Observable<Passenger> {
      return this.dataService.add(this.NAMESPACE, itemToAdd);
    }

    public updateAsset(id: any, itemToUpdate: any): Observable<Passenger> {
      return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
    }

    public deleteAsset(id: any): Observable<Passenger> {
      return this.dataService.delete(this.NAMESPACE, id);
    }

}
