import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Title } from '@angular/platform-browser';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-payroll',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './payroll.component.html',
  styleUrl: './payroll.component.scss'
})
export class PayrollComponent {

  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  cityOrRural: string[] = [];
  selectedcityOrRural!: any;

  circle!: any[];
  selectedcircle!: any;

  officeCode!: any[];
  selectedofficeCode!: any;

  dcode!: any[];
  selecteddcode!: any;

  data1: any;
  options1: any;

  data2: any;
  options2: any;

  data3: any;
  options3: any;

  data4: any;
  options4: any;

  data5: any;
  options5: any;

  constructor(private title: Title) {
    this.title.setTitle('Payroll');
  }

  ngOnInit() {
    this.items = [
      { label: 'Payroll' }
    ];
    this.home = { icon: 'pi pi-home' };

    this.payrollMtdDoughnutchart();
    this.payrollYtdDoughnutchart();
    this.incomeTaxBarChart();
    this.payBreakdownBarChart();
    this.deductionsBreakdownBarChart();
  }

  payrollMtdDoughnutchart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data1 = {
      labels: ['Regular Pay', 'Benefits', 'Tax'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
        }
      ]
    };


    this.options1 = {
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      }
    };
  }

  payrollYtdDoughnutchart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data2 = {
      labels: ['Regular Pay', 'Benefits', 'Tax'],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
        }
      ]
    };


    this.options2 = {
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      }
    };
  }

  incomeTaxBarChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data3 = {
      labels: ['Income Tax', 'Professional Tax'],
      datasets: [
        {
          data: [540, 325],
          backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)'],
          borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)'],
          borderWidth: 1
        }
      ]
    };

    this.options3 = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

  payBreakdownBarChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data4 = {
      labels: [
        'Basic Pay',
        'Personal Pay',
        'Special Pay',
        'DA',
        'HRA',
        'CCA',
        'Medical Allowance',
        'Winter Allowance',
        'Cash Allowance'
      ],
      datasets: [
        {
          data: [540, 325, 150, 200, 120, 300, 100, 180, 220], // Add appropriate data for each label
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(201, 203, 207, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(100, 181, 246, 0.2)',
            'rgba(76, 175, 80, 0.2)'
          ],
          borderColor: [
            'rgb(255, 159, 64)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(255, 205, 86)',
            'rgb(201, 203, 207)',
            'rgb(255, 99, 132)',
            'rgb(100, 181, 246)',
            'rgb(76, 175, 80)'
          ],
          borderWidth: 1
        }
      ]
    };

    this.options4 = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

  deductionsBreakdownBarChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data5 = {
      labels: [
        'GPF',
        'VPF',
        'CPS',
        'SPF',
        'FBF',
        'NHIS',
        'GPF Loan',
        'GPF Arrear',
        'CPS Arrear',
        'Festival Advance',
        'Marriage'
      ],
      datasets: [
        {
          data: [540, 325, 150, 200, 120, 300, 100, 180, 220, 170, 130], // Add appropriate data for each label
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(201, 203, 207, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(100, 181, 246, 0.2)',
            'rgba(76, 175, 80, 0.2)',
            'rgba(244, 67, 54, 0.2)',
            'rgba(33, 150, 243, 0.2)'
          ],
          borderColor: [
            'rgb(255, 159, 64)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(255, 205, 86)',
            'rgb(201, 203, 207)',
            'rgb(255, 99, 132)',
            'rgb(100, 181, 246)',
            'rgb(76, 175, 80)',
            'rgb(244, 67, 54)',
            'rgb(33, 150, 243)'
          ],
          borderWidth: 1
        }
      ]
    };

    this.options5 = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }
}
