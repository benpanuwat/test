import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
//import { SocialAuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser } from "angularx-social-login";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public barLabel: string = "ความปลอดภัยของรหัสผ่าน :";

  //user: SocialUser;

  public member = {
    email: "",
    password: "",
    confirm_password: "",
    fname: "",
    lname: ""
  };

  loginValidation: boolean = false;
  loginMass: string = "";
  createValidation: boolean = false;
  createMass: string = "";

  constructor(private http: HttpClient, private service: AppService) {
  }

  ngOnInit(): void {
    // this.authService.authState.subscribe((user) => {


    // });
  }

  // signInWithFB(): void {
  //   this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  // }

  // signInWithGoogle(): void {
  //   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  // }

  clickCreateAccount(f) {

    console.log(f);

    if (f.invalid === true) {
      this.createValidation = true;
      this.createMass = "กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง";
    }
    else if (this.member.password.length < 8 || this.member.confirm_password.length < 8) {
      this.createValidation = true;
      this.createMass = "กรุณากำหนดรหัสผ่านมากกว่า 8 ตัวอักษร";
    }
    else if (this.member.password != this.member.confirm_password) {
      this.createValidation = true;
      this.createMass = "รหัสผ่านและยืนยันระหัสผ่านไม่ตรงกัน";
    }
    else {
      this.http.post<any>(this.service.url + '/api/create_member', this.member, {}).subscribe(res => {
        if (res.status) {

          localStorage.setItem("auth", res.success);
          localStorage.setItem("id", res.data.member.id);
          localStorage.setItem("name", res.data.member.name);
          localStorage.setItem("email", res.data.member.email);
          localStorage.setItem("token", res.data.token);

          window.location.href = "acc_information";
        }
        else {
          if (res.message == "Email already exists.") {
            this.createValidation = true;
            this.createMass = "อีเมลนี้ทำการลงทะเบียนแล้ว";
          }
          else {
            this.createValidation = true;
            this.createMass = "ระบบไม่สามารถลงทะเบียนได้";
          }
        }
      });
    }

  }

}
