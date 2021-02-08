import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  public data = {
    category: []
  };

  constructor(private http: HttpClient, private service: AppService) {
  }

  ngOnInit(): void {
    this.http.post<any>(this.service.url + '/api/get_footer', {}, {}).subscribe(res => {
      if (res.code == 200) {
        this.data = res.data;
        this.data.category.forEach(function (value) {
          value.url = btoa(value.id);
        });
      }
    });
  }

}
