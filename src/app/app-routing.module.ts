import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/AuthGuard';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { CategoryComponent } from './category/category.component';
import { BlogComponent } from './blog/blog.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';

import { MyAccountComponent } from './profile/my-account/my-account.component';
import { MyAddressComponent } from './profile/my-address/my-address.component';
import { MyOrderComponent } from './profile/my-order/my-order.component';
import { MyPasswordComponent } from './profile/my-password/my-password.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'product', component: ProductComponent },
  { path: 'login', component: LoginComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'blog_detail', component: BlogDetailComponent },
  { path: 'checkout', component: CheckoutComponent , canActivate: [AuthGuard]},
  { path: 'myaccount', component: MyAccountComponent , canActivate: [AuthGuard]},
  { path: 'myaddress', component: MyAddressComponent , canActivate: [AuthGuard]},
  { path: 'myorder', component: MyOrderComponent , canActivate: [AuthGuard]},
  { path: 'mypassword', component: MyPasswordComponent , canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
