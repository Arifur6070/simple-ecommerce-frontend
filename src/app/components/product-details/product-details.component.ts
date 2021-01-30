import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartStatusService } from '../cart-status/service/cart-status.service';
import { CartItem } from '../cart-status/model/cart.model';
import { Product } from '../products/model/product.model';
import { ProductService } from '../products/service/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product:Product=new Product();
  constructor(
    private productService:ProductService,
    private route:ActivatedRoute,
    private cartService:CartStatusService
  ) { }

  ngOnInit(): void {

    this.handleProductDetails();

  }

  handleProductDetails() {

    const productId = +this.route.snapshot.paramMap.get('id');

    this.productService.getProductById(productId).subscribe(
      data => {
        this.product=data;
        console.log(this.product);
      }
    );

  }

  addToCart(item:Product){
    console.log(item.name);
    const carItem:CartItem=new CartItem(item);
    this.cartService.addToCart(carItem);
 }

}
