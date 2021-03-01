import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.css']
})
export class MyOrderComponent implements OnInit {

  public headers: HttpHeaders;

  public data: any = {
    status_count: {
      order: 0,
      payment: 0,
      packing: 0,
      delivery: 0,
      finish: 0,
      cancel: 0
    },
    orders: []
  };

  public filter = {
    status: 'all'
  }

  warnValidation: boolean = false;
  warnMass: string = "";
  succValidation: boolean = false;
  succMass: string = "";

  constructor(private http: HttpClient, private service: AppService) {
  }

  ngOnInit(): void {
    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Authorization', localStorage.getItem('token'));

    this.http.post<any>(this.service.url + '/api/get_order_list', this.filter, { headers: this.headers }).subscribe(res => {
      if (res.code == 200) {
        this.data = res.data;

        let that = this;
        this.data.orders.forEach(function (value1) {
          value1.products.forEach(function (value2) {
            value2.path = that.service.url + "/" + value2.path
            value2.url = btoa(value2.product_id);
          });
        });
      }
      else if (res.code == 401) {
        localStorage.clear();
        window.location.href = "login";
      }
    });
  }

  clickTab(status) {
    this.filter.status = status;

    this.http.post<any>(this.service.url + '/api/get_order_list', this.filter, { headers: this.headers }).subscribe(res => {
      if (res.code == 200) {
        this.data = res.data;

        let that = this;
        this.data.orders.forEach(function (value1) {
          value1.products.forEach(function (value2) {
            value2.path = that.service.url + "/" + value2.path
            value2.url = btoa(value2.product_id);
          });
        });
      }
      else if (res.code == 401) {
        localStorage.clear();
        window.location.href = "login";
      }
      else {
        this.warnMessage(res.massage);
      }
    });

  }

  warnMessage(mass) {
    this.succValidation = false;
    this.warnValidation = true;
    this.warnMass = mass;
  }

  succMessage(mass) {
    this.warnValidation = false;
    this.succValidation = true;
    this.succMass = mass;
  }

}
