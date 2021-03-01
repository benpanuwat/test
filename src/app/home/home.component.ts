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
    banners: [],
    product_recommend: [],
    product_new: [],
    category: []
  };

  ngOnInit(): void {

    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Authorization', localStorage.getItem('token'));

    this.http.post<any>(this.service.url + '/api/get_home', {}, {}).subscribe(res => {
      if (res.status) {
        this.data = res.data;

        let that = this;
        this.data.banners.forEach(function (value) {
          value.path = that.service.url + "/" + value.path
        });

        this.data.partner.forEach(function (value) {
          value.path = that.service.url + "/" + value.path
        });

        this.data.product_recommend.forEach(function (value) {
          value.path = that.service.url + "/" + value.path
          value.url = btoa(value.product_id);
          value.cat_url = btoa(value.category_id);
        });

        this.data.product_new.forEach(function (value) {
          value.path = that.service.url + "/" + value.path
          value.url = btoa(value.product_id);
          value.cat_url = btoa(value.category_id);
        });

        this.data.category.forEach(function (value) {
          value.path = that.service.url + "/" + value.path
          value.cat_url = btoa(value.id);
        });

        this.data.news.forEach(function (value) {
          value.path = that.service.url + "/" + value.path
          value.url = btoa(value.id);

            value.month_name = that.service.monthMap[parseInt(value.month)];
            value.month_name_en = that.service.monthMap_en[parseInt(value.month)];
        });

        this.service.loaded();
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
