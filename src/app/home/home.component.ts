import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public headers: HttpHeaders;

  constructor(private http: HttpClient, private service: AppService) {
  }


  public data: any = {
    product_new: []
  };

  ngOnInit(): void {

    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Authorization', localStorage.getItem('token'));

    this.http.post<any>(this.service.url + '/api/get_product_home', {}, {}).subscribe(res => {
      if (res.status) {
        this.data = res.data;
        let that = this;
        
        this.data.product_recommend.forEach(function (value) {
          value.path = that.service.url + "/" + value.path
          value.url = btoa(value.product_id);
        });

        this.data.product_new.forEach(function (value) {
          value.path = that.service.url + "/" + value.path
          value.url = btoa(value.product_id);
        });
      }
    });

  }

  addOrder(product) {
    if (localStorage.getItem('auth') == "true") {

      let data: any = {
        product_id: product.product_id
      };

      this.http.post<any>(this.service.url + '/api/add_cart', data, { headers: this.headers }).subscribe(res => {
        if (res.code == 200) {
          window.location.reload();
        }
      });

    }
    else {
      window.location.href = "login";
    }
  }

}
