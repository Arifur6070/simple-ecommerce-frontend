import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Purchase } from 'src/app/common/model/purchase.model';
import { Country } from 'src/app/common/shared-model/country.model';
import { State } from 'src/app/common/shared-model/state.model';

@Injectable({
  providedIn: 'root'
})
export class CheckOutService {

  private countriesUrl="http://localhost:8080/api/countries";
  private statesUrl="http://localhost:8080/api/states";
  private purchaseUrl="http://localhost:8080/api/checkout/purchase";

  constructor(
    private http:HttpClient
  ) { }

  getCreditCardMonths(startMonth:number):Observable<number[]>{

    let data:number[] =[];
    for(let theMonth =startMonth;theMonth <= 12; theMonth++ ){
      data.push(theMonth);
    }
     return of(data);
  }


  getCreditCardYears():Observable<number[]>{

    let data:number[] =[];
    const startYear = new Date().getFullYear();
    const endYear=startYear+10;
    for(let theYear = startYear;theYear <= endYear; theYear++ ){
      data.push(theYear);
    }
    return of(data);
  }

  getCountries(){
     return this.http.get<GetCountryResponse>(this.countriesUrl).pipe(
       map(response => response._embedded.countries)
     );
  }

  getStates(){
    return this.http.get<GetStateResponse>(this.countriesUrl).pipe(
      map(response => response._embedded.states)
    );
 }


 getStatesByCountryCode(code:string){
  const searchUrl = `${this.statesUrl}/search/findByCountryCode?code=${code}`
  return this.http.get<GetStateResponse>(searchUrl).pipe(
    map(response => response._embedded.states)
  );
 }

 placeOrder(purchaseOrder:Purchase): Observable<any>{

  return this.http.post<Purchase>(this.purchaseUrl,purchaseOrder);

 }


}

interface GetCountryResponse{
   _embedded:{
     countries: Country[];
   }
}

interface GetStateResponse{
  _embedded:{
    states: State[];
  }
}


