import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductCategory } from 'src/app/common/model/product-category.model';
import { Product } from '../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {



  private baseUrl="http://localhost:8080/api/products";

  constructor(
    private http:HttpClient
  ) { }

  getProducts(categoryId:number){

    const searchUrl=`${this.baseUrl}/search/findByCategoryId?id=${categoryId}`
      return this.http.get<GetResponseProducts>(searchUrl).pipe(
        map(response => response._embedded.products)
      );
  }

  getProductsPaginate(thePage:number,thePageSize,categoryId:number){

    const searchUrl=`${this.baseUrl}/search/findByCategoryId?id=${categoryId}`+`&page=${thePage}&size=${thePageSize}`;
      return this.http.get<GetResponseProducts>(searchUrl);
  }

  getProductsByKeyword(keyword:string): Observable<Product[]>{

    const searchKeywordUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`
    return this.http.get<GetResponseProducts>(searchKeywordUrl).pipe(
      map(response => response._embedded.products)
    );

  }

  getProductCategories(): Observable<ProductCategory[]>{

    const categoryUrl = "http://localhost:8080/api/product-category"

    return this.http.get<GetResponseProductCategory>(categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );

  }

  getProductById(productId: number) {

    const productDetailsUrl = `${this.baseUrl}/${productId}`;

    return this.http.get<Product>(productDetailsUrl);

  }

}



interface GetResponseProducts{
  _embedded: {
    products:Product[]
  },
  page: {
    size:number,
    totalElements:number,
    totalPages:number,
    number:number
  }
}

interface GetResponseProductCategory{
  _embedded: {
    productCategory:ProductCategory[]
  }
}
