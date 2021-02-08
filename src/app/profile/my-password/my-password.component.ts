import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-my-password',
  templateUrl: './my-password.component.html',
  styleUrls: ['./my-password.component.css']
})
export class MyPasswordComponent implements OnInit {

  public headers: HttpHeaders;
  public barLabel: string = "ความปลอดภัยของรหัสผ่าน :";

  public member = {
    old_password: "",
    new_password: "",
    confirm_password: ""
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

  clickSavePassword(f) {
    if (f.invalid === true) {
      this.warnMessage("กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง");
    }
    else if (this.member.new_password.length < 8 || this.member.confirm_password.length < 8) {
      this.warnValidation = true;
      this.warnMessage("กรุณากำหนดรหัสผ่านมากกว่า 8 ตัวอักษร");
    }
    else if (this.member.new_password != this.member.confirm_password) {
      this.warnMessage("รหัสผ่านและยืนยันระหัสผ่านไม่ตรงกัน");
    }
    else {

      this.http.post<any>(this.service.url + '/api/reset_password', this.member, { headers: this.headers }).subscribe(res => {
        if (res.code == 200) {
          this.succMessage("บันทึกข้อมูลสำเร็จ");
        }
        else if (res.code == 401) {
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
