import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public userLogin = {
    auth: "",
    id: "",
    name: ""
  };

  public category = [{
    id: "",
    name: ""
  }];

  constructor(private http: HttpClient, private service: AppService) {
  }

  ngOnInit(): void {

    this.userLogin.auth = localStorage.getItem('auth');
    this.userLogin.id = localStorage.getItem('id');
    this.userLogin.name = localStorage.getItem('name');

    this.http.post<any>(this.service.url + '/api/get_category', {}, {}).subscribe(res => {
      if (res.code == 200) {
        this.category = res.data;
      }
    });
  }

  clickLogout() {
    localStorage.clear();
    window.location.href = "login";
  }

}
