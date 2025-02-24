import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnDestroy {
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor() {
    const changeDetectorRef = inject(ChangeDetectorRef);
    const media = inject(MediaMatcher);

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }


  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/tnhb/dashboard'},
      { label: 'Land Digit', icon: 'pi pi-image', routerLink: '/tnhb/land-digit' },
      { label: 'Monitoring', icon: 'pi pi-desktop' , routerLink:'/tnhb/monitoring'},
       { label: 'Payroll', icon: 'pi pi-wallet', routerLink: '/tnhb/payroll' },
       {label: 'Personnel', icon:'pi pi-shield', routerLink: '/tnhb/personnel'},
      { label: 'Sales & Property', icon: 'pi pi-cart-plus' },
      { label: 'Vendor', icon: 'pi pi-money-bill' },
      { label: 'Accounts', icon: 'pi pi-receipt' },
      // { label: 'Pension', icon: 'pi pi-shield' },
      { label: 'NOC', icon: 'pi pi-book' },
    ];
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  shouldRun = /(^|.)(stackblitz|webcontainer).(io|com)$/.test(window.location.host);
}
