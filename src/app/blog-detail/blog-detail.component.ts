import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {

  public headers: HttpHeaders;

  public blog: any = {
    id: '',
    user:{
      fname:'',
      lname:''
    }
  }

  public blog_date: any = [{
    blog_month: '',
    blog_year: '',
    count: 0,
    blog_month_th: ''
  }];

  public filter: any = {
    search: '',
  }


  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient, private service: AppService) {
  }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      const b = params['b'];
      if (b != "" && b != undefined)
        this.blog.id = atob(b);
    });


    this.http.post<any>(this.service.url + '/api/get_blog_date', {}, { headers: this.headers }).subscribe(res => {
      if (res.code == 200) {
        this.blog_date = res.data;
      }
    });

    this.http.post<any>(this.service.url + '/api/get_blog_detail', this.blog, { headers: this.headers }).subscribe(res => {
      if (res.code == 200) {

        this.blog = res.data;

        let that = this;
        this.blog.blog_images.forEach(function (value) {
          value.path = that.service.url + "/" + value.path
        });

        this.blog.blog_other.forEach(function (value) {
          value.path = that.service.url + "/" + value.path
          value.url = btoa(value.id);
        });

        this.service.loaded();
      }
    });
  }

  clickSearch()
  {
    window.location.href = 'blog?search=' + this.filter.search;
  }


}
