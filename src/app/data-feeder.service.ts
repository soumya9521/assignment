import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class DataFeederService {
  constructor(private http: HttpClient) {}

  getOrder() {
    return this.http.get('https://mocki.io/v1/d58c7abf-efeb-4312-b1f3-241113c02b92');
  }
}
