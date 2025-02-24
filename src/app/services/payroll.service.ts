import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {

  payrollapi: string = `${environment.payrollUrl}`;

  constructor(private http: HttpClient) { }
}
