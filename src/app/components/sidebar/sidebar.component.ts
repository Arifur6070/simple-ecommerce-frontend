import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { ProductCategory } from 'src/app/common/model/product-category.model';
import { ProductService } from '../products/service/product.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  productCategories:ProductCategory[];

  isAuthenticated:boolean;

  constructor(
    private productService:ProductService,
    private oktaAuthService:OktaAuthService
  ) { }

  ngOnInit(): void {
    this.oktaAuthService.$authenticationState.subscribe(
      (result) => {
        this.isAuthenticated=result;
        this.listProductCategories();
      }
    );

  }

  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        this.productCategories=data;

      }
    );
  }

}
