import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router'
import { AppService } from 'src/app/app.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public headers: HttpHeaders;
  public translate: TranslateService;
  public language: string;
  public url;

  public param = {
    a: "aaaaa",
    b: "กกกกก"
  }

  public userLogin = {
    auth: "",
    id: "",
    name: ""
  };

  public data = {
    cart: {
      count_total: 0,
      price_total: 0,
      products: []
    },
    category: []
  };

  public search_data = {
    search: '',
    category_id: ''
  };

  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient, private service: AppService, translate: TranslateService, private router: Router,) {

    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.url = event.url.split('/')[1].split("?")[0];
      }
    });

    this.translate = translate;
    this.language = localStorage.getItem('language')
    if (this.language == 'en')
      this.translate.setDefaultLang('en');
    else
      this.translate.setDefaultLang('th');
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem("language", lang);
    this.language = lang;
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const c = params['c'];

      if (c != "" && c != undefined)
        this.search_data.category_id = atob(c);

      const s = params['s'];
      if (s != "" && s != undefined)
        this.search_data.search = s;
    });

    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Authorization', localStorage.getItem('token'));

    this.userLogin.auth = localStorage.getItem('auth');
    this.userLogin.id = localStorage.getItem('id');
    this.userLogin.name = localStorage.getItem('name');

    if (localStorage.getItem('auth') == "true") {

      this.http.post<any>(this.service.url + '/api/get_header_login', {}, { headers: this.headers }).subscribe(res => {
        if (res.code == 200) {
          this.data = res.data;

          let that = this;
          this.data.cart.products.forEach(function (value) {
            value.path = that.service.url + "/" + value.path
            value.url = btoa(value.product_id);
            if (value.name.length > 42) {
              value.name = value.name.substring(0, 40) + "..";
            }
          });

          this.data.category.forEach(function (value) {
            value.url = btoa(value.id);
          });
        }
        else if (res.code == 401) {
          localStorage.clear();
          window.location.href = "login";
        }
      });
    }
    else {
      this.http.post<any>(this.service.url + '/api/get_header', {}, {}).subscribe(res => {
        if (res.code == 200) {
          this.data = res.data;

          this.data.category.forEach(function (value) {
            value.url = btoa(value.id);
          });
        }
      });
    }
  }

  clickSearch() {
    window.location.href = "category?c=" + btoa(this.search_data.category_id) + "&s=" + this.search_data.search;
  }

  clickLogout() {
    localStorage.clear();
    window.location.href = "login";
  }

  clickDelectCart(pro) {
    this.http.post<any>(this.service.url + '/api/delete_cart', pro, { headers: this.headers }).subscribe(res => {
      if (res.code == 200) {
        window.location.reload();
      }
    });
  }
}
