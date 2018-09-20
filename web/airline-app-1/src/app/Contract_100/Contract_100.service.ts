import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { Contract_100 } from '../org.acme.airline1';
import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class Contract_100Service {

	
		private NAMESPACE: string = 'Contract_100';
	



    constructor(private dataService: DataService<Contract_100>) {
    };

    public getAll(): Observable<Contract_100[]> {
        return this.dataService.getAll(this.NAMESPACE);
    }

    public getAsset(id: any): Observable<Contract_100> {
      return this.dataService.getSingle(this.NAMESPACE, id);
    }

    public addAsset(itemToAdd: any): Observable<Contract_100> {
      return this.dataService.add(this.NAMESPACE, itemToAdd);
    }

    public updateAsset(id: any, itemToUpdate: any): Observable<Contract_100> {
      return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
    }

    public deleteAsset(id: any): Observable<Contract_100> {
      return this.dataService.delete(this.NAMESPACE, id);
    }

}
