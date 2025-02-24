import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { Title } from '@angular/platform-browser';
import { MenuItem } from 'primeng/api';
import { PersonnelService } from '../services/personnel.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-personnel',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './personnel.component.html',
  styleUrl: './personnel.component.scss'
})
export class PersonnelComponent {

  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  cityOrRural: any[] = [
    { label: 'City', value: 'city' },
    { label: 'Rural', value: 'rular' },
    { label: 'Head Office', value: 'head_office' },
  ];
  selectedcityOrRural!: any;

  officeCode!: any[];
  selectedofficeCode!: any;

  technical: any[] = ['Technical', 'Ministerial'];
  selectedtechnical: any = '';

  ce!: any[];
  selectedDesignation: any[] = [];

  under37!: any[];
  selectedunder37!: any;

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

  data6: any;
  options6: any;

  data7: any;
  options7: any;

  data8: any;
  options8: any;

  data9: any;
  options9: any;

  data10: any;
  options10: any;

  data11: any;
  options11: any;

  data12: any;
  options12: any;

  data13: any;
  options13: any;

  data14: any;
  options14: any;

  data15: any;
  options15: any;

  data16: any;
  options16: any;

  sanctionData: any = [];
  staffDetails: any[] = [];

  constructor(private title: Title, private personnelService: PersonnelService) {
    this.title.setTitle('Personnel');
  }

  ngOnInit() {
    this.items = [
      { label: 'Personnel' }
    ];
    this.home = { icon: 'pi pi-home' };

    this.getCadreName();
    this.getHolisticCount([], []);

    this.directBarChart();
    this.compassionateBarChart();
    this.boardChart1();
    this.pendingPieChart1();
    this.suspensionChart1();
    this.boardChart2();
    this.pendingPieChart2();
    this.suspensionChart2();
    this.boardChart3();
    this.pendingPieChart3();
    this.suspensionChart3();
  }

  getOfficeCode() {
    this.personnelService.getOfficeCode(this.selectedcityOrRural.value).subscribe(
      (res: any) => {
        console.log(res);
        this.officeCode = res.data;
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  getCadreName() {
    this.personnelService.getCadreName(this.selectedtechnical).subscribe(
      (res: any) => {
        console.log(res);
        this.sanctionData = res;
        this.ce = res.data.map((i: any) => i.cadreName);
        this.getSanctionValues(res);
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  filterCadre() {
    if (this.selectedDesignation.length > 0) {
      const result = {
        data: this.sanctionData.data.filter((i: any) => this.selectedDesignation.includes(i.cadreName))
      };
      console.log(result);
      this.getSanctionValues(result);
    } else {
      this.getSanctionValues(this.sanctionData);
    }
  }

  getSanctionValues(res?: any) {
    let totalSanctioned: number = 0;
    let present: number = 0;
    let vacant: number = 0;

    res.data.forEach((i: any) => {
      totalSanctioned += i.sanctioned;
      present += i.present;
      vacant += i.vacant;
    });

    this.sanctionCountDoughnutchart(totalSanctioned, present, vacant);
  }

  sanctionCountDoughnutchart(totalSanctioned: number, present: number, vacant: number) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data1 = {
      labels: ['Present', 'Vacant'],
      datasets: [
        {
          data: [present, vacant],
          backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--green-500')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--green-400')]
        }
      ]
    };

    this.options1 = {
      responsive: true,
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        },
        tooltip: {
          enabled: true
        },
        // Local plugin for center text
        centerText: {
          id: 'centerText',
          beforeDraw(chart: any) {
            const { width, height, ctx } = chart;
            ctx.restore();
            const fontSize = 16;
            ctx.font = `${fontSize}px sans-serif`;
            ctx.textBaseline = 'middle';
            ctx.fillStyle = textColor;

            const text = `Total: ${totalSanctioned}`;
            const textX = Math.round((width - ctx.measureText(text).width) / 2);
            const textY = height / 2;

            ctx.fillText(text, textX, textY);
            ctx.save();
          }
        }
      }
    };
  }

  //
  getHolisticCount(cadre: any, office: any): void {
    const data = {
      cadreCodes: cadre,
      officeCodes: office
    };

    this.personnelService.getHolisticCount(data).subscribe(
      (res: any) => {
        console.log(res);
        this.staffDetails = res.data;

        // Initialize gender counts
        let maleCount = 0;
        let femaleCount = 0;
        let othersCount = 0;

        let workingCount = 0;
        let retiredCount = 0;

        let disabilityCount = 0;
        let notDisabilityCount = 0;

        // Count each gender
        this.staffDetails.forEach((item: any) => {
          if (item.gender === 'Male') {
            maleCount++;
          } else if (item.gender === 'Female') {
            femaleCount++;
          } else {
            othersCount++;
          }
        });

        this.staffDetails.forEach((item: any) => {
          if (item.retirementPermittedStatus == '') {
            workingCount++;
          } else {
            retiredCount++;
          }
        });

        this.staffDetails.forEach((item: any) => {
          if (item.differentlyAbled == 'Yes') {
            disabilityCount++;
          } else {
            notDisabilityCount++;
          }
        });

        // Pass gender counts to the chart
        this.genderBarChart(maleCount, femaleCount, othersCount);
        this.workingPieChart(workingCount, retiredCount);
        this.disabilityChart(disabilityCount, notDisabilityCount);

        const { labels, sanctionedData, presentData, vacantData } = this.getCountsByCadre(this.staffDetails);
        this.designationwiseBarChart(labels, sanctionedData, presentData, vacantData);
      },
      (err: any) => {
        console.error('Error fetching holistic count:', err);
      }
    );
  }

  getCountsByCadre(employees: any[]) {
    const cadreCounts = employees.reduce((acc, emp) => {
      const cadreName = emp.cadreName;

      // Initialize counts if cadreName is encountered for the first time
      if (!acc[cadreName]) {
        acc[cadreName] = { sanctioned: 0, present: 0, vacant: 0 };
      }

      // Increment sanctioned count for each employee in this cadre
      acc[cadreName].sanctioned++;

      // Increment present count if employeeId is non-null
      if (emp.employeeId) {
        acc[cadreName].present++;
      }

      // Vacant is calculated as sanctioned - present
      acc[cadreName].vacant = acc[cadreName].sanctioned - acc[cadreName].present;

      return acc;
    }, {} as Record<string, { sanctioned: number; present: number; vacant: number }>);

    // Prepare data for the chart
    const labels = Object.keys(cadreCounts);
    const sanctionedData = labels.map(cadre => cadreCounts[cadre].sanctioned);
    const presentData = labels.map(cadre => cadreCounts[cadre].present);
    const vacantData = labels.map(cadre => cadreCounts[cadre].vacant);

    return { labels, sanctionedData, presentData, vacantData };
  }

  filterStaffDetails() {
    // Filter sanctionData by matching cadreName with any value in selectedDesignation array
    const cadreCodes = this.sanctionData.data
      .filter((i: { cadreName: any; }) => this.selectedDesignation.includes(i.cadreName))
      .map((i: { cadreCode: any; }) => i.cadreCode); // Assuming `cadreCode` is the correct property name

    // Call getHolisticCount with the filtered cadre codes and selected office code
    this.getHolisticCount(cadreCodes, this.selectedofficeCode);
  }

  genderBarChart(male: number, female: number, others: number): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data2 = {
      labels: ['Male', 'Female', 'Others'],
      datasets: [
        {
          label: 'Gender Distribution',
          data: [male, female, others],
          backgroundColor: ['rgba(255, 159, 64, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(54, 162, 235, 0.7)'],
          borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)'],
          borderWidth: 1,
          hoverBackgroundColor: ['rgba(255, 159, 64, 0.9)', 'rgba(75, 192, 192, 0.9)', 'rgba(54, 162, 235, 0.9)']
        }
      ]
    };

    this.options2 = {
      responsive: true,
      maintainAspectRatio: false, // Ensures chart fills the container without fixed aspect ratio
      plugins: {
        legend: {
          display: true,
          labels: {
            color: textColor,
            font: {
              size: 12 // Adjust font size as needed
            }
          }
        },
        tooltip: {
          enabled: true,
          backgroundColor: textColor,
          titleColor: textColorSecondary
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
            stepSize: 1, // Ensures integer values for gender count
            font: {
              size: 12 // Font size for readability
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              size: 12
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      },
      layout: {
        padding: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10
        }
      }
    };
  }

  workingPieChart(workingCount: number, retiredCount: number) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data3 = {
      labels: ['Working', 'Retired'],
      datasets: [
        {
          data: [workingCount, retiredCount],
          backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
        }
      ]
    };

    this.options3 = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    };
  }

  disabilityChart(disability: number, notDisability: number) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data4 = {
      labels: ['Yes', 'No'],
      datasets: [
        {
          label: 'Count',
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          data: [disability, notDisability]
        }
      ]
    };

    this.options4 = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
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

  designationwiseBarChart(labels: string[], sanctionedData: number[], presentData: number[], vacantData: number[]) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data5 = {
      labels: labels, // Array of designation labels
      datasets: [
        {
          label: 'Sanctioned',
          data: sanctionedData,
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: 'rgb(255, 159, 64)',
          borderWidth: 1
        },
        {
          label: 'Present',
          data: presentData,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1
        },
        {
          label: 'Vacant',
          data: vacantData,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        }
      ]
    };

    this.options5 = {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        },
        tooltip: {
          enabled: true
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


  directBarChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data6 = {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'Sales',
          data: [540, 325, 702, 620],
          backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
          borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
          borderWidth: 1
        }
      ]
    };

    this.options6 = {
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

  compassionateBarChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data7 = {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'Sales',
          data: [540, 325, 702, 620],
          backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
          borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
          borderWidth: 1
        }
      ]
    };

    this.options7 = {
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

  boardChart1() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data8 = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: 'My Second dataset',
          backgroundColor: documentStyle.getPropertyValue('--pink-500'),
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    };

    this.options8 = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
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

  pendingPieChart1() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data9 = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: [540, 325, 702],
          backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
        }
      ]
    };

    this.options9 = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    };
  }

  suspensionChart1() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data10 = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: 'My Second dataset',
          backgroundColor: documentStyle.getPropertyValue('--pink-500'),
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    };

    this.options10 = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
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

  boardChart2() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data11 = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: 'My Second dataset',
          backgroundColor: documentStyle.getPropertyValue('--pink-500'),
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    };

    this.options11 = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
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

  pendingPieChart2() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data12 = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: [540, 325, 702],
          backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
        }
      ]
    };

    this.options12 = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    };
  }

  suspensionChart2() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data13 = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: 'My Second dataset',
          backgroundColor: documentStyle.getPropertyValue('--pink-500'),
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    };

    this.options13 = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
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

  boardChart3() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data14 = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: 'My Second dataset',
          backgroundColor: documentStyle.getPropertyValue('--pink-500'),
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    };

    this.options14 = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
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

  pendingPieChart3() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data15 = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: [540, 325, 702],
          backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
        }
      ]
    };

    this.options15 = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    };
  }

  suspensionChart3() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data16 = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: 'My Second dataset',
          backgroundColor: documentStyle.getPropertyValue('--pink-500'),
          borderColor: documentStyle.getPropertyValue('--pink-500'),
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    };

    this.options16 = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
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
