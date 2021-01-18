import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import { Location } from 'src/app/app.location';

@Component({
  selector: 'app-my-address',
  templateUrl: './my-address.component.html',
  styleUrls: ['./my-address.component.css']
})
export class MyAddressComponent implements OnInit {

  public headers: HttpHeaders;

  public member: any = {
    address: []
  };

  public listProvince = [];

  warnValidation: boolean = false;
  warnMass: string = "";
  succValidation: boolean = false;
  succMass: string = "";

  constructor(private http: HttpClient, private service: AppService, public location: Location) {
  }

  ngOnInit(): void {
    this.listProvince = this.location.province;
    this.listProvince.sort(this.compareValues('province_th'));

    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Authorization', localStorage.getItem('token'));

    this.loadAddress();
  }

  loadAddress()
  {
    this.http.post<any>(this.service.url + '/api/get_address', {}, { headers: this.headers }).subscribe(res => {
      if (res.code == 200) {
        this.member.address = res.data;

        let that = this;
        this.member.address.forEach(function (add) {

          that.setProvince(add)
          add.amphoe_code = that.location.amphoe.find(a => a.amphoe_code == add.amphoe_code).amphoe_code;
          
          that.setamphoe(add)
          add.district_code = that.location.district.find(a => a.district_code == add.district_code).district_code;
        });

        if (this.member.address.length == 0)
          this.clickAddAddress();
      }
    });
  }

  setProvince(add) {
    add.listAmphoe = this.location.amphoe.filter(a => a.province_code == add.province_code);
    add.listAmphoe.sort(this.compareValues('amphoe_th_s'));

    this.setamphoe(add);
  }

  setamphoe(add) {
    add.listDistrict = this.location.district.filter(a => a.amphoe_code == add.amphoe_code);
    add.listDistrict.sort(this.compareValues('district_th_s'));

    this.changeDistrict(add);
  }


  changeProvince(add) {
    add.listAmphoe = this.location.amphoe.filter(a => a.province_code == add.province_code);
    add.listAmphoe.sort(this.compareValues('amphoe_th_s'));
    add.amphoe_code = add.listAmphoe[0].amphoe_code;

    this.changeamphoe(add);
  }

  changeamphoe(add) {
    add.listDistrict = this.location.district.filter(a => a.amphoe_code == add.amphoe_code);
    add.listDistrict.sort(this.compareValues('district_th_s'));
    add.district_code = add.listDistrict[0].district_code;

    this.changeDistrict(add);
  }

  changeDistrict(add) {
    add.zipcode = this.location.district.find(e => e.district_code === add.district_code).zipcode;
  }

  clickAddAddress() {
    if (this.member.address.length < 5) {
      this.member.address.push({
        id: "",
        name: "",
        tel: "",
        province: "",
        amphoe: "",
        district: "",
        zipcode: "",
        others: "",
        province_code: "",
        amphoe_code: "",
        district_code: "",
        listAmphoe: [],
        listDistrict: []
      });
    }
  }

  clickDeleteAddress(add) {
    const index = this.member.address.indexOf(add);
    if (index > 0) {
      this.member.address.splice(index, 1);
    }
  }

  clickSaveAddress() {
    let statusAddress = true;

    this.member.address.forEach(function (add) {
      if (add.name == "" || add.tel.length < 9 || add.province_code == "" || add.amphoe_code == "" || add.district_code == "" || add.zipcode == "") {
        statusAddress = false;
      }
    });

    if (statusAddress) {

      let that = this;
      this.member.address.forEach(function (add) {
        add.province = that.location.province.find(a => a.province_code == add.province_code).province_th;
        add.amphoe = that.location.amphoe.find(a => a.amphoe_code == add.amphoe_code).amphoe_th_s;
        add.district = that.location.district.find(a => a.district_code == add.district_code).district_th_s;

        if (add.province == undefined)
          add.province = "";

        if (add.amphoe == undefined)
          add.amphoe = "";

        if (add.district == undefined)
          add.district = "";
      });

      this.http.post<any>(this.service.url + '/api/update_address', this.member, { headers: this.headers }).subscribe(res => {
        if (res.code == 200) {
          this.loadAddress();
          this.succMessage("บันทึกข้อมูลสำเร็จ");
        }
        else {
          this.warnMessage("ระบบไม่สามารถบันทึกข้อมูลได้");

        }
      });
    }
    else {
      this.warnMessage("กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง");
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

  compareValues(key, order = 'asc') {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }

}
