import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
//import { AppResponse } from './appResponse.modal';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
//import { AuthService } from './auth.service';

const API_URL = environment.payrollUrl;
const Personal_apiUrl = environment.personnelUrl;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  // DashBoard
  getALLDashboard(): Observable<any> {
    // Create request params

    // Make the GET request with params
    return this.http.get(`${API_URL}/api/dashboard`);
  }

  getSummary(): Observable<any> {
    // Create request params

    // Make the GET request with params
    return this.http.get(`${API_URL}/api/summary`);
  }
  getOfficecode(requestBody: any): Observable<any> {
    // Make the POST request with requestBody
    return this.http.post(`${Personal_apiUrl}/getAllOfficeCode`, requestBody);
  }

  getDesignation(requestBody: any): Observable<any> {
    // Make the POST request with requestBody
    return this.http.post(`${Personal_apiUrl}/getAllCadreCode`, requestBody);
  }

  getALLDashboard_filter(
    officeCode?: any,
    designationCode?: any,
    month?: any,
    year?: any
  ): Observable<any> {
    let params = new HttpParams();

    // Add parameters conditionally
    if (officeCode && officeCode.length > 0) {
      params = params.set('officeCode', officeCode.toString());
    }
    if (designationCode && designationCode.length > 0) {
      params = params.set('designationCode', designationCode.toString());
    }
    if (month) {
      params = params.set('month', month.toString());
    }
    if (year) {
      params = params.set('year', year.toString());
    }

    // Make the GET request with the filtered params
    return this.http.get(`${API_URL}/api/dashboard`, { params });
  }

  getSummary_filter(month?: any, year?: any): Observable<any> {
    let params = new HttpParams();

    if (month) {
      params = params.set('month', month.toString());
    }
    if (year) {
      params = params.set('year', year.toString());
    }
    return this.http.get(`${API_URL}/api/summary`, { params });
  }
}
