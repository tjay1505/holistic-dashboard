import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonnelService {

  personnelapi: string = `${environment.personnelUrl}`;

  constructor(private http: HttpClient) { }

  getOfficeCode(data: any): Observable<any> {
    return this.http.post<any>(`${this.personnelapi}/cityOrRular?value=${data}`, {});
  }

  getCadreName(data: any): Observable<any> {
    return this.http.post<any>(`${this.personnelapi}/designation?value=${data}`, {});
  }

  getHolisticCount(data: any): Observable<any> {
    return this.http.post<any>(`${this.personnelapi}/holisticCount`, data);
  }
}
