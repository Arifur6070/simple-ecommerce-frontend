import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/shared-model/country.model';
import { State } from 'src/app/common/shared-model/state.model';
import { CheckOutService } from './check-out.service';
import {SpaceValidators} from '../../common/form-validators/space.validators';
import { CartStatusService } from '../cart-status/service/cart-status.service';
import { Router } from '@angular/router';
import { Order } from 'src/app/common/model/order.model';
import { OrderItem } from 'src/app/common/model/order-item.model';
import { Purchase } from 'src/app/common/model/purchase.model';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit {

  checkOutFormGroup: FormGroup;
  totalPrice:number=0;
  totalQuantity:number=0;


  creditCardYears:number[]=[];
  creditCardMonths:number[]=[];

  countries:Country[] = [];
  SAstates:State[] = [];
  BAstates:State[] = [];
  constructor(
    private checkOutService:CheckOutService,
    private cartService:CartStatusService,
    private formBuilder: FormBuilder,
    private router:Router
  ) { }

  ngOnInit(): void {

    this.reviewCartDetails();


    this.checkOutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
                              [Validators.required,
                               Validators.minLength(2),
                               SpaceValidators.notOnlyWhiteSpace]),

        lastName:  new FormControl('',
                              [Validators.required,
                               Validators.minLength(2),
                               SpaceValidators.notOnlyWhiteSpace]),

        email: new FormControl('',
                              [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2),
                                     SpaceValidators.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2),
                                   SpaceValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2),
                                      SpaceValidators.notOnlyWhiteSpace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2),
                                     SpaceValidators.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2),
                                   SpaceValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2),
                                      SpaceValidators.notOnlyWhiteSpace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard:  new FormControl('', [Validators.required, Validators.minLength(2),
                                          SpaceValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });




    const startMonth: number = new Date().getMonth() + 1;
    this.checkOutService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    );


    this.checkOutService.getCreditCardYears().subscribe(
      data => {
        this.creditCardYears = data;
      }
    );

    this.checkOutService.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    );


    // this.checkOutService.getStatesByCountryCode().subscribe(
    //   data => {
    //     this.states = data;
    //   }
    // );

  }

  onSubmit(){
    if (this.checkOutFormGroup.invalid) {
      this.checkOutFormGroup.markAllAsTouched();
      return;
    }
     // set up order
     let order = new Order();
     order.totalPrice = this.totalPrice;
     order.totalQuantity = this.totalQuantity;

     // get cart items
     const cartItems = this.cartService.cartItems;

     // create orderItems from cartItems
     // - long way
     /*
     let orderItems: OrderItem[] = [];
     for (let i=0; i < cartItems.length; i++) {
       orderItems[i] = new OrderItem(cartItems[i]);
     }
     */

     // - short way of doing the same thingy
     let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

     // set up purchase
     let purchase = new Purchase();

     // populate purchase - customer
     purchase.customer = this.checkOutFormGroup.controls['customer'].value;

     // populate purchase - shipping address
     purchase.shippingAddress = this.checkOutFormGroup.controls['shippingAddress'].value;
     const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
     const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
     purchase.shippingAddress.state = shippingState.name;
     purchase.shippingAddress.country = shippingCountry.name;

     // populate purchase - billing address
     purchase.billingAddress = this.checkOutFormGroup.controls['billingAddress'].value;
     const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
     const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
     purchase.billingAddress.state = billingState.name;
     purchase.billingAddress.country = billingCountry.name;

     // populate purchase - order and orderItems
     purchase.order = order;
     purchase.orderItems = orderItems;

     // call REST API via the CheckoutService
     this.checkOutService.placeOrder(purchase).subscribe({
         next: response => {
           alert(`Your order has been received.\nOrder tracking number: ${response.purchaseTrackingNumber}`);

           // reset cart
           this.resetCart();

         },
         error: err => {
           alert(`There was an error: ${err.message}`);
         }
       }
     );

  }

  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset the form
    this.checkOutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl("/products");
  }


  copyShippingAddressToBillingAddress($event){

    if($event.target.checked){
      this.checkOutFormGroup.controls.billingAddress.setValue(this.checkOutFormGroup.controls.shippingAddress.value);
      this.BAstates=this.SAstates;
    }
    else{
      this.checkOutFormGroup.controls.billingAddress.reset();
      this.BAstates=[];
    }
  }
  handleMonthsAndYears(){
    const creditCardGroup=this.checkOutFormGroup.get('creditCard');

    const getCurrentYear:number = new Date().getFullYear();
    const selectedYear:number = Number(creditCardGroup.value.expirationYear);
    let startMonth:number;
    if(getCurrentYear === selectedYear){
      startMonth=new Date().getMonth()+1;
    }else{
      startMonth=1;
    }

    this.checkOutService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    )
  }

  getStates(formGroupName:string){

    const formGroup = this.checkOutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;

    this.checkOutService.getStatesByCountryCode(countryCode).subscribe(
      data => {
        if( formGroupName === 'shippingAddress'){
          this.SAstates = data;
        }else{
          this.BAstates = data;
        }

        formGroup.get('state').setValue(data[0]);
      }
    );

  }
  //for accessing the template values
  get firstName() { return this.checkOutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkOutFormGroup.get('customer.lastName'); }
  get email() { return this.checkOutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkOutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkOutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkOutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkOutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkOutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet() { return this.checkOutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkOutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkOutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkOutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkOutFormGroup.get('billingAddress.country'); }

  get creditCardType() { return this.checkOutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkOutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkOutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkOutFormGroup.get('creditCard.securityCode'); }


  reviewCartDetails() {

    // subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    // subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );

  }

}
