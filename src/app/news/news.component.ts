import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  public headers: HttpHeaders;

  public news_date: any = [{
    news_month: '',
    news_year: '',
    count: 0,
    news_month_th: ''
  }];


  public news: any = [{
    id: '',
    title: '',
    detail: '',
    created_at: '',
    user_id: '',
    fname:'',
    lname:''
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
    month: '',
    year: '',
    length: 5,
    search: '',
    start: 0,
    order_by: ''
  }

  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient, private service: AppService) {
  }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      const search = params['search'];
      if (search != "" && search != undefined)
        this.filter.search = search;

      const month = params['month'];
      if (month != "" && month != undefined)
        this.filter.month = month;

      const year = params['year'];
      if (year != "" && year != undefined)
        this.filter.year = year;
    });

    this.http.post<any>(this.service.url + '/api/get_news_date', {}, { headers: this.headers }).subscribe(res => {
      if (res.code == 200) {
        this.news_date = res.data;
      }
    });

    this.loadBlog();
  }

  loadBlog() {

    this.filter.start = (this.page.page_current - 1) * this.filter.length;

    this.http.post<any>(this.service.url + '/api/get_news_page', this.filter, {}).subscribe(res => {
      this.news = res.data;

      let that = this;
      this.news.forEach(function (value) {
        value.path = that.service.url + "/" + value.path
        value.url = btoa(value.id);
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

      this.service.loaded();
    });
  }

  clickSearch() {
    window.location.href = 'news?search=' + this.filter.search;
  }

  clickPage(but) {
    this.page.page_current = but;
    this.loadBlog()
  }

  clickPrev() {
    this.page.page_current = 1;
    this.loadBlog()
  }

  clickLast() {
    this.page.page_current = this.page.page_count;
    this.loadBlog()
  }

  clickDate(bd) {
    this.loadBlog();
  }

}
