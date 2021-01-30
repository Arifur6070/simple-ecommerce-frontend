import { Component, OnInit } from '@angular/core';
import { CartStatusService } from '../cart-status/service/cart-status.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.scss']
})
export class CartStatusComponent implements OnInit {

  totalPrice:number=0.0;
  totalQuantity:number=0;


  constructor(
    private cartService:CartStatusService
  ) { }

  ngOnInit(): void {

    this.updateCartService();
  }

  updateCartService() {
    this.cartService.totalPrice.subscribe(
      data => {
        this.totalPrice=data;
      }
    );
    this.cartService.totalQuantity.subscribe(
      data => {
        this.totalQuantity = data;
      }
    );
  }

}
