import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.css']
})
export class NewsDetailComponent implements OnInit {

  public headers: HttpHeaders;

  public news: any = {
    id: '',
    user:{
      fname:'',
      lname:''
    }
  }

  public news_date: any = [{
    news_month: '',
    news_year: '',
    count: 0,
    news_month_th: ''
  }];

  public filter: any = {
    search: '',
  }


  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient, private service: AppService) {
  }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      const n = params['n'];
      if (n != "" && n != undefined)
        this.news.id = atob(n);
    });


    this.http.post<any>(this.service.url + '/api/get_news_date', {}, { headers: this.headers }).subscribe(res => {
      if (res.code == 200) {
        this.news_date = res.data;
      }
    });

    this.http.post<any>(this.service.url + '/api/get_news_detail', this.news, { headers: this.headers }).subscribe(res => {
      if (res.code == 200) {

        this.news = res.data;

        let that = this;
        this.news.news_images.forEach(function (value) {
          value.path = that.service.url + "/" + value.path
        });

        this.service.loaded();
      }
    });
  }

  clickSearch()
  {
    window.location.href = 'news?search=' + this.filter.search;
  }


}
