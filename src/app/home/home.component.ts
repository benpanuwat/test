import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient, private service: AppService) {
  }


  public data: any = {
    product_new: []
  };

  ngOnInit(): void {

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

}
