import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public headers: HttpHeaders;

  public userLogin = {
    auth: "",
    id: "",
    name: ""
  };

  public data = {
    cart: {
      count_total: 0,
      price_total: 0,
      products: []
    },
    category: []
  };

  constructor(private http: HttpClient, private service: AppService) {
  }

  ngOnInit(): void {

    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Authorization', localStorage.getItem('token'));

    this.userLogin.auth = localStorage.getItem('auth');
    this.userLogin.id = localStorage.getItem('id');
    this.userLogin.name = localStorage.getItem('name');

    if (localStorage.getItem('auth') == "true") {

      this.http.post<any>(this.service.url + '/api/get_header_login', {}, { headers: this.headers }).subscribe(res => {
        if (res.code == 200) {
          this.data = res.data;

          let that = this;
          this.data.cart.products.forEach(function (value) {
            value.path = that.service.url + "/" + value.path
            value.url = btoa(value.product_id);
            if (value.name.length > 42) {
              value.name = value.name.substring(0, 40) + "..";
            }
          });
        }
      });
    }
    else {
      this.http.post<any>(this.service.url + '/api/get_header', {}, {}).subscribe(res => {
        if (res.code == 200) {
          this.data = res.data;
        }
      });
    }
  }

  clickLogout() {
    localStorage.clear();
    window.location.href = "login";
  }

}
