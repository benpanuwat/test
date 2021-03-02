import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AppService {

  //public url = "http://127.0.0.1:8000";
  public url = "https://www.truelinemed.com/api/public";


  public monthMap = {
    1: 'ม.ค.',
    2: 'ก.พ.',
    3: 'มี.ค.',
    4: 'เม.ย.',
    5: 'พ.ค.',
    6: 'มิ.ย.',
    7: 'ก.ค.',
    8: 'ส.ค.',
    9: 'ก.ย.',
    10: 'ต.ค.',
    11: 'พ.ย.',
    12: 'ธ.ค.'
  };

  
  public monthMap_en = {
    1: 'Jan.',
    2: 'Feb.',
    3: 'Mar.',
    4: 'Apr.',
    5: 'May',
    6: 'Jun.',
    7: 'Jul.',
    8: 'Aug.',
    9: 'Sep.',
    10: 'Oct.',
    11: 'Nov.',
    12: 'Dec.'
  };


  constructor() { }

  loaded() {

    localStorage.setItem('load', 'true');
  }

}
