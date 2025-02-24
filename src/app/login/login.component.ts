import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private title: Title) {
    this.title.setTitle('Login');
  }
}
