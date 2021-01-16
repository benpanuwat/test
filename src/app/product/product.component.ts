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

  public product: any = {
    product_id: "",
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
    this.activatedRoute.queryParams.subscribe(params => {
      const p = params['p'];
      if (p != "")
        this.product.product_id = atob(p);
    });

    this.http.post<any>(this.service.url + '/api/get_product_detail', this.product, {}).subscribe(res => {
      if (res.status) {
        this.product = res.data;

        let that = this;
        this.product.product_image.forEach(function (value) {
          value.path = that.service.url + "/" + value.path
        });
        this.product.product_type_id = this.product.product_type[0].id;
        this.changeType();
      }
    });
  }

  changeType() {
    this.productTypeSelect = this.product.product_type.find(e => e.id == this.product.product_type_id);
    this.changeCount();
  }

  changeCount() {
    if (this.product.count > this.productTypeSelect.stock)
      this.product.count = this.productTypeSelect.stock;

    if (this.productTypeSelect.stock > 0)
      this.productTypeSelect.disabled = true;
  }
}
