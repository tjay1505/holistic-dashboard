import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LandService {

  landapi: string = `${environment.landUrl}`;

  constructor(private http: HttpClient) { }

  getCity(): Observable<any> {
    return this.http.get<any>(`${this.landapi}/City`);
  }

  getCircles(City: string): Observable<any> {
    return this.http.get<any>(`${this.landapi}/Circle/${City}`);
  }

  getDivision(City: string, Circle: any): Observable<any> {
    return this.http.get<any>(`${this.landapi}/Division/${City}/${Circle}`);
  }

  getDistricts(City: string, Circle: any, Division: any): Observable<any> {
    return this.http.get<any>(`${this.landapi}/District/${City}/${Circle}/${Division}`);
  }

  getVillages(City: string, Circle: any, Division: any, District: any): Observable<any> {
    return this.http.get<any>(`${this.landapi}/Village/${City}/${Circle}/${Division}/${District}`);
  }

  //
  getTotalLandAcquistion(data: any): Observable<any> {
    return this.http.post<any>(`${this.landapi}/mdDashboard/filter`, data);
  }

  getUnderLitigationLand1(data: any): Observable<any> {
    return this.http.post<any>(`${this.landapi}/grouped-by-unique-id`, data);
  }

  getUnderLitigationLand2(data: any): Observable<any> {
    return this.http.post<any>(`${this.landapi}/getsumdata`, data);
  }

}
