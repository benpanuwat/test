import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/app.service';

declare const $: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  public headers: HttpHeaders;

  public data = {
    cart: {
      count_total: 0,
      price_total: 0,
      products: []
    },
    address: [],
    payment: []
  };

  public checkout = {
    step: 1,
    count_total: 0,
    price_total: 0,
    payment: "0000000000000000000",
    slip: {},
    next_product: true,
    next_address: true,
    next_select_payment: true,
    new_order: true
  };

  public addressSelect: any = {
    name: '',
    others: '',
    district: '',
    amphoe: '',
    province: '',
    zipcode: '',
    tel: ''
  }

  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient, private service: AppService) {
  }

  ngOnInit(): void {

    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Authorization', localStorage.getItem('token'));

    this.http.post<any>(this.service.url + '/api/get_checkout', {}, { headers: this.headers }).subscribe(res => {
      if (res.code == 200) {

        this.data = res.data;

        let that = this;
        this.data.cart.products.forEach(function (value) {
          value.path = that.service.url + "/" + value.path
          value.url = btoa(value.product_id);
          value.select = true;
        });

        this.data.payment.forEach(function (value) {
          value.select = false;
        });

        this.data.address.forEach(function (value) {
          value.select = false;
        });

        if (this.data.address.length > 0) {
          this.data.address[0].select = true;

          this.addressSelect.name = this.data.address[0].name;
          this.addressSelect.others = this.data.address[0].others;
          this.addressSelect.district = this.data.address[0].district;
          this.addressSelect.amphoe = this.data.address[0].amphoe;
          this.addressSelect.province = this.data.address[0].province;
          this.addressSelect.tel = this.data.address[0].tel;

          this.checkout.next_address = false;
        }

        if (this.data.payment.length > 0) {
          this.data.payment[0].select = true;
          this.checkout.next_select_payment = false;
        }

        this.sumary()

        this.activatedRoute.queryParams.subscribe(params => {
          const step = params['step'];
          if (step != "" && step != undefined)
            this.checkout.step = step;
        });

      }
    });
  }

  clickSelectProduct(pro) {
    if (pro.select)
      pro.select = false;
    else
      pro.select = true;

    this.sumary()
  }


  sumary() {
    let that = this;
    that.checkout.count_total = 0;
    that.checkout.price_total = 0;
    this.data.cart.products.forEach(function (value) {
      if (value.select) {
        that.checkout.count_total++;
        that.checkout.price_total += value.price;
      }
    });

    if (that.checkout.count_total > 0)
      that.checkout.next_product = false;
    else
      that.checkout.next_product = true;
  }

  clickNextSelectProduct() {
    this.checkout.step = 2;
  }

  clickBackSelectAddress() {
    this.checkout.step = 1;
  }

  clickSelectAddress(add) {
    this.data.address.forEach(function (value) {
      value.select = false;
    });
    add.select = true;

    this.addressSelect.name = add.name;
    this.addressSelect.others = add.others;
    this.addressSelect.district = add.district;
    this.addressSelect.amphoe = add.amphoe;
    this.addressSelect.province = add.province;
    this.addressSelect.tel = add.tel;
  }

  clickNextSelectAddress() {
    this.checkout.step = 3;
  }

  clickBackSelectPayment() {
    this.checkout.step = 2;
  }

  clickSelectPayment(pay) {
    this.data.payment.forEach(function (value) {
      value.select = false;
    });
    pay.select = true;
  }

  clickNextSelectPayment() {
    this.checkout.step = 4;

    this.http.post<any>(this.service.url + '/api/get_qrcode', this.checkout, { headers: this.headers }).subscribe(res => {
      if (res.code == 200) {
        this.checkout.payment = res.data;
        this.checkout.step = 4;
      }
    });
  }

  clickBackPayment() {
    this.checkout.step = 3;
  }

  clickConfirmPayment() {
    $('#confirmPayment').modal("show");
  }

  clickPayment() {

    $('#confirmPayment').modal("hide");

    let req = {
      products: [],
      address_id: '',
      price_total: this.checkout.price_total,
      slip: this.checkout.slip,
    }

    this.data.cart.products.forEach(function (value) {
      if (value.select)
        req.products.push(value);
    });

    this.data.address.forEach(function (value) {
      if (value.select)
        req.address_id = value.id;
    });

    this.http.post<any>(this.service.url + '/api/create_order', req, { headers: this.headers }).subscribe(res => {
      if (res.code == 200) {
        this.checkout.step = 5;
      }
    });
  }

  ckickUploadSlip() {
    $("#uploadSlip").click();
  }

  onFileChange(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.reduceImage(event.target.result).then(compressed => {
          this.checkout.slip = compressed;
          this.checkout.new_order = false;
        })
      }
    }
  }

  reduceImage(src) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const elem = document.createElement('canvas');
        elem.width = img.width;
        elem.height = img.height;
        const ctx = elem.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const data = ctx.canvas.toDataURL('image/jpeg', 0.5);
        res(data);
      }
      img.onerror = error => rej(error);
    })
  }

}
