import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  public headers: HttpHeaders;

  public product: any = {
    id: "",
    name: "",
    description: "",
    detail: "",
    product_type_id: "",
    product_image: [],
    product_type: [],
    count: 1
  };

  public productTypeSelect: any = {
    id: "",
    price: "",
    disabled: true
  }

  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient, private service: AppService) {
  }

  ngOnInit(): void {

    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Authorization', localStorage.getItem('token'));

    this.activatedRoute.queryParams.subscribe(params => {
      const p = params['p'];
      if (p != "")
        this.product.product_id = atob(p);
    });

    this.http.post<any>(this.service.url + '/api/get_product_detail', this.product, {}).subscribe(res => {
      if (res.status) {
        this.product = res.data;
        this.product.count = 1;

        let that = this;
        this.product.product_image.forEach(function (value) {
          value.path = that.service.url + "/" + value.path
        });
        this.product.product_type_id = this.product.product_type[0].id;
        this.changeType();

        this.service.loaded();
      }
    });
  }

  changeType() {
    this.productTypeSelect = this.product.product_type.find(e => e.id == this.product.product_type_id);
    this.changeCount();
  }

  changeCountReduce() {
    if (this.product.count > 1) {
      this.product.count--;
      //this.changePrice();
    }
  }

  changeCountIncrease() {
    this.product.count++;
    //this.changePrice();

    if (this.product.count > this.productTypeSelect.stock)
      this.product.count = this.productTypeSelect.stock;
  }

  changeCount() {
    if (this.product.count > this.productTypeSelect.stock)
      this.product.count = this.productTypeSelect.stock;

    if (this.product.count <= 0) {
      this.product.count = 1;
    }
    //this.changePrice();
  }

  addOrder() {

    if (localStorage.getItem('auth') == "true") {

      let data: any = {
        product_id: this.product.id,
        product_type_id: this.productTypeSelect.id,
        price: this.productTypeSelect.price,
        count: this.product.count
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
