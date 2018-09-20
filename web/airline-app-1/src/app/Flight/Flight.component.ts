import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
// import { PassengerService } from './Passenger.service';
import { FlightService } from './Flight.service';
import 'rxjs/add/operator/toPromise';



// *****************************
// *****************************

@Component({
	selector: 'app-Flight',
	templateUrl: './Flight.component.html',
	styleUrls: ['./Flight.component.css'],
  providers: [FlightService]
})

export class FlightComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
	private errorMessage;

  
      flightNumber = new FormControl("", Validators.required);
  
      dateDepart = new FormControl("", Validators.required);
  
      basePriceEconomy = new FormControl("", Validators.required);
  
      basePriceBusiness = new FormControl("", Validators.required);
  
      accountBalance = new FormControl("", Validators.required);
  
      // wallet = new FormControl("", Validators.required);
  

  constructor(private serviceFlight:FlightService, fb: FormBuilder) {
    this.myForm = fb.group({
        
          flightNumber:this.flightNumber,
              
          dateDepart:this.dateDepart,
       
          basePriceEconomy:this.basePriceEconomy,  

          basePriceBusiness:this.basePriceBusiness, 
        
          accountBalance:this.accountBalance,
   
    });
  };

  ngOnInit(): void {
    this.loadAll();
    // console.log("basePriceEconomy: " + this.basePriceEconomy)
  }

  loadAll(): Promise<any> {
    let tempList = [];
    return this.serviceFlight.getAll()
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
      $class: "org.acme.airline1.Flight",
             
          "flightNumber":this.flightNumber.value,
      
          "dateDepart":this.dateDepart.value,    
        
          "basePriceEconomy":this.basePriceEconomy.value,
              
          "basePriceBusiness":this.basePriceBusiness.value,

          "accountBalance":this.accountBalance.value,
    };

    this.myForm.setValue({
              
          "flightNumber":null,
      
          "dateDepart":null,
      
          "basePriceEconomy":null,
     
          "basePriceBusiness":null,   
        
          "accountBalance":null,    
    });

    return this.serviceFlight.addAsset(this.asset)
    .toPromise()
    .then(() => {
			this.errorMessage = null;
      this.myForm.setValue({
             
        "flightNumber":null,
      
        "dateDepart":null,
    
        "basePriceEconomy":null,
   
        "basePriceBusiness":null,   
      
        "accountBalance":null, 
     
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
      $class: "org.acme.airline1.Flight",
            
            "dateDepart":this.dateDepart.value,

            "basePriceEconomy":this.basePriceEconomy.value,
   
            "basePriceBusiness":this.basePriceBusiness.value,
 
            "accountBalance":this.accountBalance.value,          
    };

    return this.serviceFlight.updateAsset(form.get("email").value,this.asset)
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

    return this.serviceFlight.deleteAsset(this.currentId)
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

    return this.serviceFlight.getAsset(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {
                       
        "flightNumber":null,
      
        "dateDepart":null,
    
        "basePriceEconomy":null,
   
        "basePriceBusiness":null,   
      
        "accountBalance":null,    
      };

      

        if(result.flightNumber){
          formObject.flightNumber = result.flightNumber;
        }else{
          formObject.flightNumber = null;
        }
      
        if(result.dateDepart){
          formObject.dateDepart = result.dateDepart;
        }else{
          formObject.dateDepart = null;
        }
      
        if(result.basePriceEconomy){
          formObject.basePriceEconomy = result.basePriceEconomy;
        }else{
          formObject.basePriceEconomy = null;
        }

        if(result.basePriceBusiness){
          formObject.basePriceBusiness = result.basePriceBusiness;
        }else{
          formObject.basePriceBusiness = null;
        }
      
        if(result.accountBalance){
          formObject.accountBalance = result.accountBalance;
        }else{
          formObject.accountBalance = null;
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
              
      "flightNumber":null,
      
      "dateDepart":null,
  
      "basePriceEconomy":null,
 
      "basePriceBusiness":null,   
    
      "accountBalance":null,   
   
      });
  }

}
