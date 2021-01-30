import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { CartItem } from '../cart-status/model/cart.model';
import { CartStatusService } from '../cart-status/service/cart-status.service';
import { Product } from './model/product.model';
import { ProductService } from './service/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products:Product[]=[];
  currentCategoryId:number=1;
  previousCategoryId: number=1;
  searchMode:boolean=false;

  //new variables for pagination
  thePageNumber: number = 1;
  thePageSize: number = 3;
  theTotalElements: number = 0;


  constructor(
    private route:ActivatedRoute,
    private productService:ProductService,
    private cartService:CartStatusService
  ) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(() => {
       this.listProducts();
    });

  }

  listProducts(){

    this.searchMode=this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleListBySearch();
    }
    else{
      this.handleListByCategoryId();
    }
  }

  handleListBySearch(){

    const keyWord=this.route.snapshot.paramMap.get('keyword');

    this.productService.getProductsByKeyword(keyWord).subscribe(
      data => {
        this.products=data;
      }
    );

  }

  handleListByCategoryId(){

    const hasCategoryId:boolean= this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      this.currentCategoryId= +this.route.snapshot.paramMap.get('id');
    }else{
      this.currentCategoryId=1;
    }

    //check if we have a different category id then the previous
    //this coming potion is for pagetion

    if(this.previousCategoryId != this.currentCategoryId){
       this.thePageNumber=1;
    }

    this.previousCategoryId=this.currentCategoryId

    this.productService.getProductsPaginate(this.thePageNumber - 1,this.thePageSize, this.currentCategoryId).subscribe(
      this.processResult()
    );
  }
  processResult(){
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  updatePageSize(pageSize: number) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(item:Product){
     console.log(item.name);
     const carItem:CartItem=new CartItem(item);
     this.cartService.addToCart(carItem);
  }
}
