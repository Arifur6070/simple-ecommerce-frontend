import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductsComponent } from './components/products/products.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-status/cart-details/cart-details.component';
import { CheckOutComponent } from './components/check-out/check-out.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/auth/login/login.component';
import { LoginStatusComponent } from './components/auth/login-status/login-status.component';



///Okta

import {
  OKTA_CONFIG,
  OktaAuthModule
} from '@okta/okta-angular';


import myAppConfig from './config/my-app-config';
import { Router } from '@angular/router';

const oktaConfig = Object.assign({
  onAuthRequired: (injector) => {
    const router = injector.get(Router);

    // Redirect the user to your custom login page
    router.navigate(['/login']);
  }
}, myAppConfig.oidc);


@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckOutComponent,
    LoginComponent,
    LoginStatusComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    OktaAuthModule
  ],
  providers: [{ provide: OKTA_CONFIG, useValue: oktaConfig }],
  bootstrap: [AppComponent]
})
export class AppModule { }
