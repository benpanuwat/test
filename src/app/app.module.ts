import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocialLoginModule, SocialAuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { QRCodeModule } from 'angularx-qrcode';



import { PasswordStrengthBarComponent } from './password-strength-bar/password-strength-bar.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ProductComponent } from './product/product.component';
import { LoginComponent } from './login/login.component';
import { MyAccountComponent } from './profile/my-account/my-account.component';
import { MyAddressComponent } from './profile/my-address/my-address.component';
import { MyOrderComponent } from './profile/my-order/my-order.component';
import { MyPasswordComponent } from './profile/my-password/my-password.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { CategoryComponent } from './category/category.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BlogComponent } from './blog/blog.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { NewsComponent } from './news/news.component';
import { NewsDetailComponent } from './news-detail/news-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ProductComponent,
    LoginComponent,
    PasswordStrengthBarComponent,
    MyAccountComponent,
    MyAddressComponent,
    MyOrderComponent,
    MyPasswordComponent,
    CheckoutComponent,
    AboutComponent,
    ContactComponent,
    CategoryComponent,
    BlogComponent,
    BlogDetailComponent,
    NewsComponent,
    NewsDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule,
    QRCodeModule,
    NoopAnimationsModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('894464140949-48fm8r2cts5thdnih542idv5k5j90p2r.apps.googleusercontent.com'),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('359033835095116'),
          }
        ],
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
