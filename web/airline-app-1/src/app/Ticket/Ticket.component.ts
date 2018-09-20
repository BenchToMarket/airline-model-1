import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { TicketService } from './Ticket.service';
import 'rxjs/add/operator/toPromise';
@Component({
	selector: 'app-Ticket',
	templateUrl: './Ticket.component.html',
	styleUrls: ['./Ticket.component.css'],
  providers: [TicketService]
})
export class TicketComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
	private errorMessage;

  
      ticketId = new FormControl("", Validators.required);
  
      classType = new FormControl("", Validators.required);
  
      status = new FormControl("", Validators.required);
  
      purchasePrice = new FormControl("", Validators.required);
  
      purchaseDate = new FormControl("", Validators.required);
  
      flight = new FormControl("", Validators.required);
  
      pnr = new FormControl("", Validators.required);
  


  constructor(private serviceTicket:TicketService, fb: FormBuilder) {
    this.myForm = fb.group({
    
        
          ticketId:this.ticketId,
        
    
        
          classType:this.classType,
        
    
        
          status:this.status,
        
    
        
          purchasePrice:this.purchasePrice,
        
    
        
          purchaseDate:this.purchaseDate,
        
    
        
          flight:this.flight,
        
    
        
          pnr:this.pnr
        
    
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    let tempList = [];
    return this.serviceTicket.getAll()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });
  }

  addAsset(form: any): Promise<any> {

    this.asset = {
      $class: "org.acme.airline1.Ticket",
      
        
          "ticketId":this.ticketId.value,
        
      
        
          "classType":this.classType.value,
        
      
        
          "status":this.status.value,
        
      
        
          "purchasePrice":this.purchasePrice.value,
        
      
        
          "purchaseDate":this.purchaseDate.value,
        
      
        
          "flight":this.flight.value,
        
      
        
          "pnr":this.pnr.value
        
      
    };

    this.myForm.setValue({
      
        
          "ticketId":null,
        
      
        
          "classType":null,
        
      
        
          "status":null,
        
      
        
          "purchasePrice":null,
        
      
        
          "purchaseDate":null,
        
      
        
          "flight":null,
        
      
        
          "pnr":null
        
      
    });

    return this.serviceTicket.addAsset(this.asset)
    .toPromise()
    .then(() => {
			this.errorMessage = null;
      this.myForm.setValue({
      
        
          "ticketId":null,
        
      
        
          "classType":null,
        
      
        
          "status":null,
        
      
        
          "purchasePrice":null,
        
      
        
          "purchaseDate":null,
        
      
        
          "flight":null,
        
      
        
          "pnr":null 
        
      
      });
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else{
            this.errorMessage = error;
        }
    });
  }


   updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: "org.acme.airline1.Ticket",
      
        
          
        
    
        
          
            "classType":this.classType.value,
          
        
    
        
          
            "status":this.status.value,
          
        
    
        
          
            "purchasePrice":this.purchasePrice.value,
          
        
    
        
          
            "purchaseDate":this.purchaseDate.value,
          
        
    
        
          
            "flight":this.flight.value,
          
        
    
        
          
            "pnr":this.pnr.value
          
        
    
    };

    return this.serviceTicket.updateAsset(form.get("ticketId").value,this.asset)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
		})
		.catch((error) => {
            if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
            else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
				this.errorMessage = error;
			}
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceTicket.deleteAsset(this.currentId)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
		})
		.catch((error) => {
            if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
				this.errorMessage = error;
			}
    });
  }

  setId(id: any): void{
    this.currentId = id;
  }

  getForm(id: any): Promise<any>{

    return this.serviceTicket.getAsset(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {
        
          
            "ticketId":null,
          
        
          
            "classType":null,
          
        
          
            "status":null,
          
        
          
            "purchasePrice":null,
          
        
          
            "purchaseDate":null,
          
        
          
            "flight":null,
          
        
          
            "pnr":null 
          
        
      };



      
        if(result.ticketId){
          formObject.ticketId = result.ticketId;
        }else{
          formObject.ticketId = null;
        }
      
        if(result.classType){
          formObject.classType = result.classType;
        }else{
          formObject.classType = null;
        }
      
        if(result.status){
          formObject.status = result.status;
        }else{
          formObject.status = null;
        }
      
        if(result.purchasePrice){
          formObject.purchasePrice = result.purchasePrice;
        }else{
          formObject.purchasePrice = null;
        }
      
        if(result.purchaseDate){
          formObject.purchaseDate = result.purchaseDate;
        }else{
          formObject.purchaseDate = null;
        }
     
        // does not work, not pulliung flight number
    
        if((result.flight).flightNumber){
          
          formObject.flight = ((result.flight).flightNumber);
        }else{
          formObject.flight = "null";
        }

        if(result.pnr){
          formObject.pnr = result.pnr;
        }else{
          formObject.pnr = null;
        }
      

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });

  }

  resetForm(): void{
    this.myForm.setValue({
      
        
          "ticketId":null,
        
      
        
          "classType":null,
        
      
        
          "status":null,
        
      
        
          "purchasePrice":null,
        
      
        
          "purchaseDate":null,
        
      
        
          "flight":null,
        
      
        
          "pnr":null 
        
      
      });
  }

}
