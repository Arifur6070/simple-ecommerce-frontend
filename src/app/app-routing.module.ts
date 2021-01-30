import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { OktaCallbackComponent,OktaAuthGuard } from '@okta/okta-angular';
import { LoginComponent } from './components/auth/login/login.component';
import { CartDetailsComponent } from './components/cart-status/cart-details/cart-details.component';
import { CheckOutComponent } from './components/check-out/check-out.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductsComponent } from './components/products/products.component';

const CALLBACK_PATH = 'login/callback';
const LOGIN_PATH = 'login';
const DEFAULT_PATH ='';
const WILDCARD_PATH='**';

const pathExceptions =[
  CALLBACK_PATH,
  LOGIN_PATH,
  DEFAULT_PATH,
  WILDCARD_PATH
];


const routes: Routes = [

  {path: CALLBACK_PATH, component: OktaCallbackComponent},
  {path: LOGIN_PATH, component: LoginComponent},
  {path:'check-out',component: CheckOutComponent},
  {path:'cart-details',component: CartDetailsComponent},
  {path:'products/:id',component: ProductDetailsComponent},
  {path:'search/:keyword',component: ProductsComponent},
  {path:'category/:id',component: ProductsComponent},
  {path:'category',component: ProductsComponent},
  {path:'products',component: ProductsComponent},
  {path:DEFAULT_PATH, redirectTo: '/login',pathMatch: 'full'},
  {path:WILDCARD_PATH, redirectTo: '/login',pathMatch: 'full'},
];


const protectedRoutes = routes.filter(route => !pathExceptions.includes(route.path));
protectedRoutes.forEach(route => {
  route.canActivate = route.canActivate || [];
  route.canActivate.push(OktaAuthGuard);
});

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
