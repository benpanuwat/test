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
    id: "",
    fname: "",
    lname: "",
    email: "",
    tel: ""
  };

  warnValidation: boolean = false;
  warnMass: string = "";
  succValidation: boolean = false;
  succMass: string = "";

  constructor(private http: HttpClient, private service: AppService) {
  }

  ngOnInit(): void {
    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Authorization', localStorage.getItem('token'));

    this.http.post<any>(this.service.url + '/api/get_memder_account', {}, { headers: this.headers }).subscribe(res => {
      if (res.code == 200) {
        this.member = res.data;
      }
    });
  }

  clickSaveAccount(f) {
    if (f.invalid === true) {
      this.warnMessage("กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง");
    }
    else {

      this.http.post<any>(this.service.url + '/api/update_memder_account', this.member, { headers: this.headers }).subscribe(res => {
        if (res.code == 200) {
          this.succMessage("บันทึกข้อมูลสำเร็จ");
        }
        else if (res.code == 401) {
          localStorage.clear();
          window.location.href = "login";
        }
        else {
          this.warnMessage(res.massage);
        }
      });
    }
  }

  warnMessage(mass) {
    this.succValidation = false;
    this.warnValidation = true;
    this.warnMass = mass;
  }

  succMessage(mass) {
    this.warnValidation = false;
    this.succValidation = true;
    this.succMass = mass;
  }

}
