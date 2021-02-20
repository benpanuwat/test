import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  public headers: HttpHeaders;

  public data: any = [{
    category: [],
    product_recommend: []
  }];

  public category: any = [{
    id: '',
    name: '',
    url: ''
  }];

  public products: any = [{
    id: '',
    name: '',
    url: '',
    path: '',
    discount: '',
  }];

  public page: any = {
    page_count: 0,
    page_current: 1,
    page_button: [],
    page_button_min: 0,
    page_button_max: 0,
    page_button_prev: false,
    page_button_last: false,
  };

  public filter: any = {
    category_id: '',
    category_name: '',
    length: 12,
    search: '',
    start: 0,
    order_by: ''
  }

  public product_list = false;

  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient, private service: AppService) {
    
  }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      const c = params['c'];
      if (c != "" && c != undefined)
        this.filter.category_id = atob(c);

      const s = params['s'];
      if (s != "" && s != undefined)
        this.filter.search = s;
    });

    this.http.post<any>(this.service.url + '/api/get_data_page', this.filter, {}).subscribe(res => {
      if (res.status) {
        this.data = res.data;

        let category = this.data.category.find(e => e.id == this.filter.category_id);

        if (category != undefined) {
          this.filter.category_name = category.name;
        }

        this.data.category.forEach(function (value) {
          value.url = btoa(value.id);
        });

        let that = this;
        this.data.product_recommend.forEach(function (value) {
          value.path = that.service.url + "/" + value.path
          value.url = btoa(value.product_id);
        });

        this.service.loaded();
      }
    });

    this.loadProduct();
  }

  loadProduct() {

    this.filter.start = (this.page.page_current - 1) * this.filter.length;

    this.http.post<any>(this.service.url + '/api/get_product_page', this.filter, {}).subscribe(res => {
      this.products = res.data;

      let that = this;
      this.products.forEach(function (value) {
        value.path = that.service.url + "/" + value.path
        value.url = btoa(value.product_id);
        value.cat_url = btoa(value.id);
      });

      this.data.banner_category.forEach(function (value) {
        value.path = that.service.url + "/" + value.path
      });

      this.page.page_button = [];
      this.page.page_count = res.last_page;
      this.page.page_button_min = this.page.page_current - 3;
      this.page.page_button_max = this.page.page_current + 3;

      for (let i = this.page.page_button_min; i <= this.page.page_button_max; i++) {
        if (i >= 1 && i <= this.page.page_count)
          this.page.page_button.push(i);
      }

      if (this.page.page_current > 4)
        this.page.page_button_prev = true;
      else
        this.page.page_button_prev = false;

      if (this.page.page_current < this.page.page_count - 3)
        this.page.page_button_last = true;
      else
        this.page.page_button_last = false;
    });
  }

  clickShowGrid() {
    this.product_list = false;
  }

  clickShowList() {
    this.product_list = true;
  }

  changeOrderBy() {
    this.loadProduct()
  }

  // clickCategory(cat) {
  //   this.filter.category_id = cat.id;
  //   this.loadProduct()
  // }

  changeLength() {
    this.loadProduct()
  }

  clickPage(but) {
    this.page.page_current = but;
    this.loadProduct()
  }

  clickPrev() {
    this.page.page_current = 1;
    this.loadProduct()
  }

  clickLast() {
    this.page.page_current = this.page.page_count;
    this.loadProduct()
  }

}
