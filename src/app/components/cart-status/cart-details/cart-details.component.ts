import { Component, OnInit } from '@angular/core';
import { CartItem } from '../model/cart.model';
import { CartStatusService } from '../service/cart-status.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.scss']
})
export class CartDetailsComponent implements OnInit {

  cartItems:CartItem[] = [];
  totalPrice:number=0;
  totalQuantity:number=0;

  constructor(
    private cartService:CartStatusService
  ) { }

  ngOnInit(): void {
    this.handleProductDetails();
  }

  handleProductDetails(){

    this.cartItems = this.cartService.cartItems;

    this.cartService.totalPrice.subscribe(
      data => this.totalPrice=data
    );

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity=data
    );

    this.cartService.computeCartTotals();

  }

  incrementQuantity(item:CartItem){

    this.cartService.addToCart(item);

  }

  decrementQuantity(item:CartItem){

    this.cartService.decrementQuantity(item);

  }

  Remove(item:CartItem){

    this.cartService.remove(item);

  }

}
