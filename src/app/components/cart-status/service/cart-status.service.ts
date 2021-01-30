import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../model/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartStatusService {


  cartItems:CartItem[]=[];
  totalPrice:Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity:Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  addToCart(theCartItem:CartItem){
    //check if the item is already in cart or not

      let alreadyExistInCart:boolean=false;
      let existingCartItem:CartItem=undefined;

      if(this.cartItems.length>0){
        //find the item in the cart based on item id
        //I find traditional one easy to understand for everyone

        for (let temCartItem of this.cartItems){
          if(temCartItem.id === theCartItem.id){
            existingCartItem=temCartItem;
            break;
          }
        }

        //refactored One{Using built in find method}:
        // existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === theCartItem.id );
        //check if we find it
        alreadyExistInCart = (existingCartItem != undefined);
      }

      if(alreadyExistInCart){
        existingCartItem.quantity++;
      }
      else{
        this.cartItems.push(theCartItem);
      }

      //compute cart total price and quantity

      this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }

  decrementQuantity(item: CartItem) {
   item.quantity-- ;
   if(item.quantity === 0){
      this.remove(item);
   }
   else{
     this.computeCartTotals();
   }
  }
  remove(item: CartItem) {
    //get index of that particular Item

     let itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === item.id);

    //if found, remove the item

    if(itemIndex > -1){

      this.cartItems.splice( itemIndex,1 );

      this.computeCartTotals();

    }


  }
}
