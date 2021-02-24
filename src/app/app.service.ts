import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AppService {

  public url = "http://127.0.0.1:8000";
  //public url = "https://www.truelinemed.com/api/public";


  constructor() { }

  loaded() {

      localStorage.setItem('load', 'true');
  }

}
