import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  public headers: HttpHeaders;

  public member = {
    id: ""
  };

  constructor(private http: HttpClient, private service: AppService) {
  }

  ngOnInit(): void {
    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Authorization', localStorage.getItem('token'));

    this.member.id = localStorage.getItem('id');

    this.http.post<any>(this.service.url + '/api/get_accunt', this.member, { headers: this.headers }).subscribe(res => {
      if (res.success) {
        this.member = res.data.member;
      }
    });
  }

}
