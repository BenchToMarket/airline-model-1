import { Component, OnInit, Input } from '@angular/core';
// import { FlightComponent } from './Flight.component';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PassengerService } from './Passenger.service';
// import { FlightService } from './Flight.service';
import 'rxjs/add/operator/toPromise';
@Component({
	selector: 'app-Passenger',
	templateUrl: './Passenger.component.html',
  // templateUrl: './participant.html',
  styleUrls: ['./Passenger.component.css'],
  // directives : [FlightComponent],
  providers: [PassengerService]

})
export class PassengerComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
	private errorMessage;

  
      email = new FormControl("", Validators.required);
  
      passengerType = new FormControl("", Validators.required);
  
      address = new FormControl("", Validators.required);
  
      accountBalance = new FormControl("", Validators.required);
  
      wallet = new FormControl("", Validators.required);
  

  constructor(private servicePassenger:PassengerService, fb: FormBuilder) {
    this.myForm = fb.group({
        
          email:this.email,
              
          passengerType:this.passengerType,
       
          address:this.address,  
        
          accountBalance:this.accountBalance,
   
          // *** wallet is ARRAY  
          wallet:this.wallet,
  
    });
  };
  

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    let tempList = [];
    return this.servicePassenger.getAll()
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
      $class: "org.acme.airline1.Passenger",
             
          "email":this.email.value,
      
          "passengerType":this.passengerType.value,    
        
          "address":this.address.value,
       
          "accountBalance":this.accountBalance.value,
       
          "wallet":this.wallet.value,   
    };

    this.myForm.setValue({
              
          "email":null,
      
          "passengerType":null,
      
          "address":null,
     
          "accountBalance":null,   
        
          "wallet":null,    
    });

    return this.servicePassenger.addAsset(this.asset)
    .toPromise()
    .then(() => {
			this.errorMessage = null;
      this.myForm.setValue({
             
          "email":null,
       
          "passengerType":null,
      
          "address":null,
      
          "accountBalance":null,
       
          "wallet":null,
     
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
      $class: "org.acme.airline1.Passenger",
            
            "passengerType":this.passengerType.value,

            "address":this.address.value,
   
            "accountBalance":this.accountBalance.value,
 
            "wallet":this.wallet.value,          
    };

    return this.servicePassenger.updateAsset(form.get("email").value,this.asset)
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

    return this.servicePassenger.deleteAsset(this.currentId)
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

    return this.servicePassenger.getAsset(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {
                       
          "email":null,
      
          "passengerType":null,
     
          "address":null,
     
          "accountBalance":null,
     
          "wallet":null,       
      };

      
        if(result.email){
          formObject.email = result.email;
        }else{
          formObject.email = null;
        }
      
        if(result.passengerType){
          formObject.passengerType = result.passengerType;
        }else{
          formObject.passengerType = null;
        }
      
        if(result.address){
          formObject.address = result.address;
        }else{
          formObject.address = null;
        }
      
        if(result.accountBalance){
          formObject.accountBalance = result.accountBalance;
        }else{
          formObject.accountBalance = null;
        }
      
        if(result.wallet){
          formObject.wallet = result.wallet;
        }else{
          formObject.wallet = null;
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
              
      "email":null,
    
      "passengerType":null,
 
      "address":null,
 
      "accountBalance":null,

      "wallet":null,
   
      });
  }

}

