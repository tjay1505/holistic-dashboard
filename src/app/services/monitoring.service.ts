import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MonitoringService {
  montoringapi: string = `${environment.monitoringUrl}`;

  constructor(private http: HttpClient) {}
  ///api/data_monitoring/combined/filter
  getAllData(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.montoringapi}/api/data_monitoring/combined/filter`,
      data
    );
  }

  getStatusCount(data: any): Observable<any> {
    return this.http.post<any>(
      `${this.montoringapi}/api/data_monitoring/status-counts`,
      data
    );
  }
}
