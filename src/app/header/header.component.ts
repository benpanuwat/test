import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {

    this.userLogin.auth = localStorage.getItem('auth');
    this.userLogin.id = localStorage.getItem('id');
    this.userLogin.name = localStorage.getItem('name');
  }

  clickLogout() {
    localStorage.clear();
    window.location.href = "login";
  }

}
