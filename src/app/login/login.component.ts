import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import { SocialAuthService, FacebookLoginProvider, GoogleLoginProvider, SocialUser } from "angularx-social-login";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public barLabel: string = "ความปลอดภัยของรหัสผ่าน :";

  user: SocialUser;

  public userlogin = {
    email: "",
    password: ""
  };

  public member = {
    provider_id: "",
    email: "",
    password: "",
    confirm_password: "",
    fname: "",
    lname: "",
    provider: ""
  };

  loginValidation: boolean = false;
  loginMass: string = "";
  createValidation: boolean = false;
  createMass: string = "";

  constructor(private http: HttpClient, private service: AppService, private authService: SocialAuthService) {
  }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {

      this.member.provider_id = user.id;
      this.member.fname = user.firstName;
      this.member.lname = user.lastName;
      this.member.email = user.email;
      this.member.provider = user.provider;//"GOOGLE FACEBOOK"

      this.http.post<any>(this.service.url + '/api/member_login_social', this.member, {}).subscribe(res => {
        if (res.code == 200) {

          localStorage.setItem("auth", res.status);
          localStorage.setItem("id", res.data.id);
          localStorage.setItem("name", res.data.fname);
          localStorage.setItem("email", res.data.email);
          localStorage.setItem("token", res.token);

          window.history.back();
        }
        else if (res.code == 400) {
          this.createValidation = true;
          this.createMass = res.massage;
        }
        else {
          this.createValidation = true;
          this.createMass = "ไม่สามารถส่งทะเบียนได้";
        }
      });

      console.log(user);
    });
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  clickLogin(f) {
    if (f.invalid === true) {
      this.loginValidation = true;
      this.loginMass = "กรุณากรอกอีเมลและรหัสผ่านให้ถูกต้อง";
    }
    else {
      this.http.post<any>(this.service.url + '/api/member_login', this.userlogin, {}).subscribe(res => {
        if (res.code == 200) {

          localStorage.setItem("auth", res.status);
          localStorage.setItem("id", res.data.id);
          localStorage.setItem("name", res.data.fname);
          localStorage.setItem("email", res.data.email);
          localStorage.setItem("token", res.token);

          window.history.back();
        }
        else if (res.code == 400) {
          this.loginValidation = true;
          this.loginMass = res.massage;
        }
        else {
          this.loginValidation = true;
          this.loginMass = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
        }
      });
    }
  }

  clickCreateAccount(f) {

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
        if (res.code == 200) {

          localStorage.setItem("auth", res.status);
          localStorage.setItem("id", res.data.id);
          localStorage.setItem("name", res.data.fname);
          localStorage.setItem("email", res.data.email);
          localStorage.setItem("token", res.token);

          window.location.href = "myaccount";
        }
        else if (res.code == 400) {
          this.createValidation = true;
          this.createMass = res.massage;
        }
        else {
          this.createValidation = true;
          this.createMass = "ไม่สามารถส่งทะเบียนได้";
        }
      });
    }

  }

}
