import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MenuItem } from 'primeng/api';
import { Title } from '@angular/platform-browser';
import moment from 'moment';
import { MonitoringService } from '../services/monitoring.service';

@Component({
  selector: 'app-monitoring',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './monitoring.component.html',
  styleUrl: './monitoring.component.scss'
})
export class MonitoringComponent {

  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  type!: any[];
  selectedtype!: any;

  cityOrRural: string[] = [];
  selectedcityOrRural!: any;

  circles!: any[];
  selectedcircle!: any;

  divisions!: any[];
  selecteddivision!: any;

  year!: any[];
  selectedyear!: any;

  month!: any[];
  selectedmonth!: any;

  project!: any[];
  selectedProject!: any;

  contractor!: any[];
  selectedContractor!: any;

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

  allData: any[] = [];

  constructor(private title: Title, private monitoringService: MonitoringService) {
    this.title.setTitle('Monitoring');
  }

  ngOnInit() {
    this.items = [
      { label: 'Monitoring Platform' }
    ];
    this.home = { icon: 'pi pi-home' };

    this.getAllData();

    this.projectsPieChart();
    // this.ptoBarChart();
    this.completionChart();
    this.physicalAndFinancialProgressBarChart();
    this.financialProgreeBarChart();
  }

  getAllData() {
    const data = {
      "circle": null,
      "cityOrRural": null,
      "division": null,
      "groupByProjectName": null,
      "groupByStatus": null,
      "month": null,
      "projectName": null
    };
    this.monitoringService.getAllData(data).subscribe(
      (res: any) => {
        this.allData = res;
        this.allData.forEach(i => {
          i.data.pmonth = i.data.month.split('-')[1];
          i.data.pyear = i.data.month.split('-')[0];
        });
        console.log(res);
        this.cityOrRural = Array.from(
          new Set(this.allData
            .map(i => i.data.citynrural)
          )
        );
        this.fetchFilteredData();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  dataChange(flag?: any) {
    if (flag == 'city' && this.selectedcityOrRural) {
      this.circles = Array.from(
        new Set(this.allData
          .filter(i => i.data.citynrural == this.selectedcityOrRural)
          .map(i => i.data.circle)
        )
      );
      this.selectedcircle = null;
      this.divisions = [];
      this.selecteddivision = null;
      this.year = [];
      this.selectedyear = null;
      this.month = [];
      this.selectedmonth = null;
      this.type = [];
      this.selectedtype = null;
    }
    if (flag == 'circle' && this.selectedcityOrRural && this.selectedcircle) {
      this.divisions = Array.from(
        new Set(this.allData
          .filter(i => i.data.citynrural == this.selectedcityOrRural)
          .filter(i => i.data.circle == this.selectedcircle)
          .map(i => i.data.division)
        )
      );
      this.selecteddivision = null;
      this.year = [];
      this.selectedyear = null;
      this.month = [];
      this.selectedmonth = null;
      this.type = [];
      this.selectedtype = null;
    }
    if (flag == 'division' && this.selectedcityOrRural && this.selectedcircle && this.selecteddivision) {
      this.year = Array.from(
        new Set(this.allData
          .filter(i => i.data.citynrural == this.selectedcityOrRural)
          .filter(i => i.data.circle == this.selectedcircle)
          .filter(i => i.data.division == this.selecteddivision)
          .map(i => i.data.pyear)
        )
      );
      this.selectedyear = null;
      this.month = [];
      this.selectedmonth = null;
      this.type = [];
      this.selectedtype = null;
    }
    if (flag == 'year' && this.selectedcityOrRural && this.selectedcircle && this.selecteddivision && this.selectedyear) {
      this.month = Array.from(
        new Set(this.allData
          .filter(i => i.data.citynrural == this.selectedcityOrRural)
          .filter(i => i.data.circle == this.selectedcircle)
          .filter(i => i.data.division == this.selecteddivision)
          .filter(i => i.data.pyear == this.selectedyear)
          .map(i => i.data.pmonth)
        )
      );
      this.selectedmonth = null;
      this.type = [];
      this.selectedtype = null;
    }
    if (flag == 'month' && this.selectedcityOrRural && this.selectedcircle && this.selecteddivision && this.selectedyear && this.selectedmonth) {
      this.type = ['Building', 'Layout'];
      this.selectedtype = null;
    }
    if (flag == 'type' && this.selectedcityOrRural && this.selectedcircle && this.selecteddivision && this.selectedyear && this.selectedtype) {
      if (this.selectedtype == 'Building') {
        this.month = Array.from(
          new Set(this.allData
            .filter(i => i.data.citynrural == this.selectedcityOrRural)
            .filter(i => i.data.circle == this.selectedcircle)
            .filter(i => i.data.division == this.selecteddivision)
            .filter(i => i.data.pyear == this.selectedyear)
            .filter(i => i.Type == 'Moni')
            .map(i => i.data.pmonth)
          )
        );
      } else {
        this.month = Array.from(
          new Set(this.allData
            .filter(i => i.data.citynrural == this.selectedcityOrRural)
            .filter(i => i.data.circle == this.selectedcircle)
            .filter(i => i.data.division == this.selecteddivision)
            .filter(i => i.data.pyear == this.selectedyear)
            .filter(i => i.Type !== 'Moni')
            .map(i => i.data.pmonth)
          )
        );
      }
    }
    this.fetchFilteredData();
  }

  fetchFilteredData() {
    const cityOrRural = this.selectedcityOrRural;
    const circle = this.selectedcircle;
    const division = this.selecteddivision;
    const year = this.selectedyear;
    const month = this.selectedmonth;
    const type = this.selectedtype;

    let totalProjects = 0;
    let totalLayout = 0;
    let totalBuildings = 0;

    console.log(cityOrRural, circle, division, year, month, type);

    // Filter and get distinct project names without modifying this.allData
    const filteredProjects = Array.from(
      this.allData.reduce((map, item) => {
        const projectName = item.data.project_name.toLowerCase();

        // Apply filters if they are available
        const matchesCityOrRural = !cityOrRural || item.data.citynrural === cityOrRural;
        const matchesCircle = !circle || item.data.circle === circle;
        const matchesDivision = !division || item.data.division === division;
        const matchesYear = !year || item.data.month.split('-')[0] === year.toString();
        const matchesMonth = !month || item.data.month.split('-')[1] === month.toString();

        // Check for type match based on selected type
        const matchesType = !type || (type === 'Layout' ? item.Type === 'Layout' : item.Type === 'Moni');

        // Add to map if criteria are met and project name doesn't contain 'test'
        if (!projectName.includes('test') && matchesCityOrRural && matchesCircle && matchesDivision && matchesYear && matchesMonth && matchesType) {
          map.set(item.data.project_name, item);
        }
        return map;
      }, new Map()).values()
    );

    console.log(this.allData);
    console.log("filtered data:", filteredProjects);

    totalProjects = filteredProjects.length;

    // Count filtered projects by Type without modifying original data
    totalLayout = filteredProjects.filter((i: any) => i.Type === 'Layout').length;
    totalBuildings = filteredProjects.filter((i: any) => i.Type === 'Moni').length;

    // Pass results to the chart function
    this.ptoBarChart(totalProjects, totalLayout, totalBuildings);
  }


  projectsPieChart() {
    this.data1 = {
      labels: ['Ongoing Projects', 'Completed Projects'],
      datasets: [
        {
          data: [50, 70],
          backgroundColor: ['rgba(75, 192, 192)', 'rgba(201, 203, 207)'],
          hoverBackgroundColor: ['rgba(75, 192, 192)', 'rgba(201, 203, 207)']
        }
      ]
    };

    this.options1 = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: '#000000'
          }
        }
      }
    };
  }

  ptoBarChart(totalProjects: number, totalLayout: number, totalBuildings: number) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data2 = {
      labels: ['Total Projects', 'Layout', 'Building'],
      datasets: [
        {
          data: [
            totalProjects,
            totalLayout,
            totalBuildings
          ],
          backgroundColor: [
            'rgba(153, 102, 255)', // Purple
            'rgba(255, 159, 64)',  // Orange
            'rgba(201, 203, 207)', // Grey
          ],
          borderColor: [
            'rgba(153, 102, 255, 1)',   // Purple
            'rgba(255, 159, 64, 1)',    // Orange
            'rgba(201, 203, 207, 1)',   // Grey
          ],
          borderWidth: 1
        }
      ]
    };

    this.options2 = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          },
          display: false
        },
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

  completionChart() {
    const projects = [
      { name: 'Project A', dueDate: '2024-10-15', actualDate: '2024-10-12' },
      { name: 'Project B', dueDate: '2024-10-20', actualDate: '2024-10-22' },
      { name: 'Project C', dueDate: '2024-10-18', actualDate: '2024-10-18' },
      { name: 'Project D', dueDate: '2024-10-25', actualDate: '2024-10-30' }
    ];

    // Calculate on time, early, and delayed counts
    const projectStatuses = projects.map((project) => {
      const due = moment(project.dueDate);
      const actual = moment(project.actualDate);
      const diff = actual.diff(due, 'days');

      return {
        name: project.name,
        onTime: diff === 0,
        early: diff < 0 ? Math.abs(diff) : 0,
        delayed: diff > 0 ? diff : 0
      };
    });

    this.data3 = {
      labels: projects.map((project) => project.name),
      datasets: [
        {
          label: 'Completed Early (Days)',
          backgroundColor: '#66BB6A',
          data: projectStatuses.map((status) => status.early)
        },
        {
          label: 'On Time',
          backgroundColor: '#42A5F5',
          data: projectStatuses.map((status) => (status.onTime ? 1 : 0)) // 1 indicates completion on time
        },
        {
          label: 'Delayed (Days)',
          backgroundColor: '#FFCA28',
          data: projectStatuses.map((status) => status.delayed)
        }
      ]
    };

    this.options3 = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true,
          beginAtZero: true,
          title: {
            display: true,
            text: 'Days'
          }
        }
      }
    };
  }

  physicalAndFinancialProgressBarChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data4 = {
      labels: ['Physical Progress', 'Financial Progress'],
      datasets: [
        {
          data: [65, 59],
          backgroundColor: [
            'purple',
            'pink',
          ],
          borderColor: [
            'purple',
            'pink',
          ],
          borderWidth: 1
        }
      ]
    };

    this.options4 = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 1.5,
      plugins: {
        legend: {
          display: false
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

  financialProgreeBarChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data5 = {
      labels: ['Agreeement', 'Expenditure', 'LC Released (Current Month/Year)'],
      datasets: [
        {
          data: [540, 325, 702, 620],
          backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)'],
          borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)'],
          borderWidth: 1
        }
      ]
    };

    this.options5 = {
      maintainAspectRatio: false,
      aspectRatio: 1.5,
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
