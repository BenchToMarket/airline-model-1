import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Contract_100Service } from './Contract_100.service';
import 'rxjs/add/operator/toPromise';
@Component({
	selector: 'app-Contract_100',
	templateUrl: './Contract_100.component.html',
	styleUrls: ['./Contract_100.component.css'],
  providers: [Contract_100Service]
})
export class Contract_100Component implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
	private errorMessage;

  
      premiumRemainingSeats = new FormControl("", Validators.required);
  
      premiumRemainingDays = new FormControl("", Validators.required);
  
      premiumMultiplier = new FormControl("", Validators.required);
  
      penaltyBuyBack = new FormControl("", Validators.required);
  
      percentResale = new FormControl("", Validators.required);
  
      contractId = new FormControl("", Validators.required);
  


  constructor(private serviceContract_100:Contract_100Service, fb: FormBuilder) {
    this.myForm = fb.group({
    
        
          premiumRemainingSeats:this.premiumRemainingSeats,
        
    
        
          premiumRemainingDays:this.premiumRemainingDays,
        
    
        
          premiumMultiplier:this.premiumMultiplier,
        
    
        
          penaltyBuyBack:this.penaltyBuyBack,
        
    
        
          percentResale:this.percentResale,
        
    
        
          contractId:this.contractId
        
    
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    let tempList = [];
    return this.serviceContract_100.getAll()
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
      $class: "org.acme.airline1.Contract_100",
      
        
          "premiumRemainingSeats":this.premiumRemainingSeats.value,
        
      
        
          "premiumRemainingDays":this.premiumRemainingDays.value,
        
      
        
          "premiumMultiplier":this.premiumMultiplier.value,
        
      
        
          "penaltyBuyBack":this.penaltyBuyBack.value,
        
      
        
          "percentResale":this.percentResale.value,
        
      
        
          "contractId":this.contractId.value
        
      
    };

    this.myForm.setValue({
      
        
          "premiumRemainingSeats":null,
        
      
        
          "premiumRemainingDays":null,
        
      
        
          "premiumMultiplier":null,
        
      
        
          "penaltyBuyBack":null,
        
      
        
          "percentResale":null,
        
      
        
          "contractId":null
        
      
    });

    return this.serviceContract_100.addAsset(this.asset)
    .toPromise()
    .then(() => {
			this.errorMessage = null;
      this.myForm.setValue({
      
        
          "premiumRemainingSeats":null,
        
      
        
          "premiumRemainingDays":null,
        
      
        
          "premiumMultiplier":null,
        
      
        
          "penaltyBuyBack":null,
        
      
        
          "percentResale":null,
        
      
        
          "contractId":null 
        
      
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
      $class: "org.acme.airline1.Contract_100",
      
        
          
            "premiumRemainingSeats":this.premiumRemainingSeats.value,
          
        
    
        
          
            "premiumRemainingDays":this.premiumRemainingDays.value,
          
        
    
        
          
            "premiumMultiplier":this.premiumMultiplier.value,
          
        
    
        
          
            "penaltyBuyBack":this.penaltyBuyBack.value,
          
        
    
        
          
            "percentResale":this.percentResale.value,
          
        
    
        
          
        
    
    };

    return this.serviceContract_100.updateAsset(form.get("contractId").value,this.asset)
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

    return this.serviceContract_100.deleteAsset(this.currentId)
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

    return this.serviceContract_100.getAsset(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {
        
          
            "premiumRemainingSeats":null,
          
        
          
            "premiumRemainingDays":null,
          
        
          
            "premiumMultiplier":null,
          
        
          
            "penaltyBuyBack":null,
          
        
          
            "percentResale":null,
          
        
          
            "contractId":null 
          
        
      };



      
        if(result.premiumRemainingSeats){
          formObject.premiumRemainingSeats = result.premiumRemainingSeats;
        }else{
          formObject.premiumRemainingSeats = null;
        }
      
        if(result.premiumRemainingDays){
          formObject.premiumRemainingDays = result.premiumRemainingDays;
        }else{
          formObject.premiumRemainingDays = null;
        }
      
        if(result.premiumMultiplier){
          formObject.premiumMultiplier = result.premiumMultiplier;
        }else{
          formObject.premiumMultiplier = null;
        }
      
        if(result.penaltyBuyBack){
          formObject.penaltyBuyBack = result.penaltyBuyBack;
        }else{
          formObject.penaltyBuyBack = null;
        }
      
        if(result.percentResale){
          formObject.percentResale = result.percentResale;
        }else{
          formObject.percentResale = null;
        }
      
        if(result.contractId){
          formObject.contractId = result.contractId;
        }else{
          formObject.contractId = null;
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
      
        
          "premiumRemainingSeats":null,
        
      
        
          "premiumRemainingDays":null,
        
      
        
          "premiumMultiplier":null,
        
      
        
          "penaltyBuyBack":null,
        
      
        
          "percentResale":null,
        
      
        
          "contractId":null 
        
      
      });
  }

}
