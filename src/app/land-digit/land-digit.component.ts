import { observable, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MenuItem } from 'primeng/api';
import { Title } from '@angular/platform-browser';
import { LandService } from '../services/land.service';

import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import { sumBy } from 'lodash';
import _ from 'lodash';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import { finalize } from 'rxjs/operators';

Chart.register(ChartDataLabels);

@Component({
  selector: 'app-land-digit',
  standalone: true,
  imports: [SharedModule, NgxSpinnerModule],
  templateUrl: './land-digit.component.html',
  styleUrl: './land-digit.component.scss',
})
export class LandDigitComponent implements OnInit {
  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  cityOrRural: string[] = [];
  selectedcityOrRural!: any;

  circles!: any[];
  selectedcircle!: any;

  divisions!: any[];
  selecteddivision!: any;

  districts!: any[];
  selecteddistrict!: any;

  villages!: any[];
  selectedvillage!: any;

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

  constructor(
    private title: Title,
    private landService: LandService,
    private spinner: NgxSpinnerService
  ) {
    this.title.setTitle('Land Digit');
  }

  ngOnInit() {
    this.items = [{ label: 'Land Digitalisation' }];
    this.home = { icon: 'pi pi-home' };

    this.getCityOrRural();
    this.getTotalLandAcquistion();
    this.underLitigationLand();

    this.awardAmountChart();
    this.releasedBarChart();
  }

  private handleSpinner<T>(observable: Observable<T>): Observable<T> {
    this.spinner.show();
    return observable.pipe(finalize(() => this.spinner.hide()));
  }

  getCityOrRural() {
    this.handleSpinner(this.landService.getCity()).subscribe(
      (res: any) => {
        console.log(res);
        this.cityOrRural = res;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getCircles() {
    this.handleSpinner(
      this.landService.getCircles(this.selectedcityOrRural)
    ).subscribe(
      (res: any) => {
        console.log(res);
        this.circles = res;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getDivision() {
    this.handleSpinner(
      this.landService.getDivision(
        this.selectedcityOrRural,
        this.selectedcircle
      )
    ).subscribe(
      (res: any) => {
        console.log(res);
        this.divisions = res;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getDistricts() {
    this.handleSpinner(
      this.landService.getDistricts(
        this.selectedcityOrRural,
        this.selectedcircle,
        this.selecteddivision
      )
    ).subscribe(
      (res: any) => {
        console.log(res);
        this.districts = res;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getVillages() {
    this.handleSpinner(
      this.landService.getVillages(
        this.selectedcityOrRural,
        this.selectedcircle,
        this.selecteddivision,
        this.selecteddistrict
      )
    ).subscribe(
      (res: any) => {
        console.log(res);
        this.villages = res;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  onCityOrRuralChange() {
    this.getCircles();
    this.selectedcircle = null;
    this.selecteddivision = null;
    this.selecteddistrict = null;
    this.selectedvillage = null;
    this.divisions = [];
    this.districts = [];
    this.villages = [];
    this.filterLandDetails();
  }

  onCircleChange() {
    this.getDivision();
    this.selecteddivision = null;
    this.selecteddistrict = null;
    this.selectedvillage = null;
    this.districts = [];
    this.villages = [];
    this.filterLandDetails();
  }

  onDivisionChange() {
    this.getDistricts();
    this.selecteddistrict = null;
    this.selectedvillage = null;
    this.villages = [];
    this.filterLandDetails();
  }

  onDistrictChange() {
    this.getVillages();
    this.selectedvillage = null;
    this.filterLandDetails();
  }

  onVillageChange() {
    this.filterLandDetails();
  }

  filterLandDetails() {
    const data = {
      division: this.selecteddivision,
      district: this.selecteddistrict,
      village: this.selectedvillage,
      circle: this.selectedcircle,
      cityorrural: this.selectedcityOrRural,
    };
    this.handleSpinner(this.landService.getTotalLandAcquistion(data)).subscribe(
      (res: any) => {
        console.log(res);
        this.totalLandAcquistionBarChart(res);
        this.landAvailablePieChart(res);
        this.ptoPntoChart(res);
        this.ptoBarChart(res);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getTotalLandAcquistion() {
    const data = {
      division: null,
      district: null,
      village: null,
      circle: null,
      cityorrural: null,
    };
    this.handleSpinner(this.landService.getTotalLandAcquistion(data)).subscribe(
      (res: any) => {
        console.log(res);
        this.totalLandAcquistionBarChart(res);
        this.landAvailablePieChart(res);
        this.ptoPntoChart(res);
        this.ptoBarChart(res);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  underLitigationLand() {
    let payload = { id: 5 };
    let getData: any = [];
    let finalData: any = [];

    this.handleSpinner(
      this.landService.getUnderLitigationLand1(payload)
    ).subscribe((data) => {
      if (data && data?.data?.length > 0) {
        getData = data.data;
        this.landService
          .getUnderLitigationLand2(payload)
          .subscribe((sumData: any) => {
            if (sumData && sumData.data.length > 0) {
              sumData.data.forEach((sumElement: any) => {
                let getFilterdData: any = [];
                getFilterdData = getData.filter(
                  (x: any) => x.uniqueid == sumElement.uniqueId
                );
                if (getFilterdData && getFilterdData.length > 0) {
                  let getCourtCase = getFilterdData[0].values.filter(
                    (x: any) => x.v_LHOSELECTEDEXTENTINLIST == 'Court Case'
                  );

                  console.log('getCourtCase', getCourtCase);

                  let getQuashed = getFilterdData[0].values.filter(
                    (x: any) => x.v_LHOSELECTEDEXTENTINLIST == 'Quashed'
                  );

                  let getEnrouchment = getFilterdData[0].values.filter(
                    (x: any) => x.v_LHOSELECTEDEXTENTINLIST == 'Encroachment'
                  );

                  let getGovDepots = getFilterdData[0].values.filter(
                    (x: any) => x.v_LHOSELECTEDEXTENTINLIST == 'Govt Depts'
                  );
                  let Others = getFilterdData[0].values.filter(
                    (x: any) => x.v_LHOSELECTEDEXTENTINLIST == 'Others'
                  );
                  let Lack_of_Approach = getFilterdData[0].values.filter(
                    (x: any) =>
                      x.v_LHOSELECTEDEXTENTINLIST == 'Lack of Approach'
                  );
                  let Scattered = getFilterdData[0].values.filter(
                    (x: any) => x.v_LHOSELECTEDEXTENTINLIST == 'Scattered'
                  );
                  let Reconveyed = getFilterdData[0].values.filter(
                    (x: any) => x.v_LHOSELECTEDEXTENTINLIST == 'Reconveyed'
                  );
                  let NocData = getFilterdData[0].values.filter(
                    (x: any) => x.v_LHOSELECTEDEXTENTINLIST == 'NOC'
                  );

                  console.log('getGovDepots', getGovDepots);

                  let courtCase: any = 0;
                  let Quashed: any = 0;
                  let enrouchment: any = 0;
                  let govtdeptsData: any = 0;
                  let othersData: any = 0;
                  let Lackofapprouchment: any = 0;
                  let ScatteredValue: any = 0;
                  let ReconveyedValue: any = 0;
                  let NocDataValue: any = 0;

                  if (getCourtCase && getCourtCase.length > 0) {
                    courtCase = _.sumBy(getCourtCase, 'v_EXTEND');
                    console.log('courtCase', courtCase);
                  }
                  if (getQuashed && getQuashed.length > 0) {
                    Quashed = _.sumBy(getQuashed, 'v_EXTEND');
                  }
                  if (getEnrouchment && getEnrouchment.length > 0) {
                    enrouchment = _.sumBy(getEnrouchment, 'v_EXTEND');
                  }
                  if (getGovDepots && getGovDepots.length > 0) {
                    govtdeptsData = _.sumBy(getGovDepots, 'v_EXTEND');
                  }
                  if (Others && Others.length > 0) {
                    othersData = _.sumBy(Others, 'v_EXTEND');
                  }
                  if (Lack_of_Approach && Lack_of_Approach.length > 0) {
                    Lackofapprouchment = _.sumBy(Lack_of_Approach, 'v_EXTEND');
                  }
                  if (Scattered && Scattered.length > 0) {
                    ScatteredValue = _.sumBy(Scattered, 'v_EXTEND');
                  }
                  if (Reconveyed && Reconveyed.length > 0) {
                    ReconveyedValue = _.sumBy(Reconveyed, 'v_EXTEND');
                  }
                  if (NocData && NocData.length > 0) {
                    NocDataValue = _.sumBy(NocData, 'v_EXTEND');
                  }
                  let data = {
                    divisionName: getFilterdData[0].V_NAME_OF_DIVISION,
                    districtName: getFilterdData[0].V_NAME_OF_DISTRICT,
                    villageName: getFilterdData[0].V_VILLAGE,
                    cityOrRural: getFilterdData[0].V_CITY_OR_RURAL,
                    circle: getFilterdData[0].V_NAME_OF_CIRCLE,
                    Court_Case: courtCase,
                    Quashed: Quashed,
                    Encroachment: enrouchment,
                    Govt_Depts: govtdeptsData,
                    Others: othersData,
                    Lack_of_Approach: Lackofapprouchment,
                    Scattered: ScatteredValue,
                    NOC: NocDataValue,
                    Reconveyed: ReconveyedValue,
                    notUtilisedExtent: sumElement.notUtilisedExtent,
                    futureDevExtent: sumElement.futureDevExtent,
                  };

                  finalData.push(data);
                }
              });
              console.log('finaldata', finalData);
              this.underLitigationBarChart(finalData);
            }
          });
      }
    });
  }

  topBoxValue: { tittle: any; val: any }[] = [
    { tittle: 'Land Acquisition - Award (in acres)', val: '0.00' },
    { tittle: 'Utilised (in acres)', val: '0.00' },
    { tittle: 'Not Utilised (in acres)', val: '0.00' },
    { tittle: 'Land Available (in acres)', val: '0.00' },
  ];

  changeTopBoxValue(field: any, value: any) {
    //console.log(field, value);

    const fieldMap: { [key: string]: number } = {
      v_TOTAL_EXTENT: 0,
      utilisedExtent: 1,
      notUtilisedExtent: 2,
      futureDevExtent: 3,
    };

    if (field in fieldMap) {
      this.topBoxValue[fieldMap[field]].val = value.toFixed(2);
    }
  }

  calculateData(field: string, data: any): any {
    //console.log(field);

    let value = 0;
    data.forEach((element: any) => {
      const fieldValue = parseFloat(element[field]);

      // Check if fieldValue is a valid number and not NaN
      if (
        !isNaN(fieldValue) &&
        fieldValue !== null &&
        fieldValue !== undefined
      ) {
        value += fieldValue;
      }
    });
    //console.log(value);

    this.changeTopBoxValue(field, value);
    //console.log(this.topBoxValue);

    return value.toFixed(2);
  }

  totalLandAcquistionBarChart(res: any) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data1 = {
      labels: [
        '4(1)',
        '6dd',
        'Award',
        'Possession Taken Over',
        'Utilised',
        'Non Utilised',
        'Land Available',
        'Possession Not Taken Over',
      ],
      datasets: [
        {
          label: 'Acres',
          data: [
            this.calculateData('fourone_total_extent', res),
            this.calculateData('sixdd_total_extent', res),
            this.calculateData('v_TOTAL_EXTENT', res),
            this.calculateData('lhoExtent1', res),
            this.calculateData('utilisedExtent', res),
            this.calculateData('notUtilisedExtent', res),
            this.calculateData('futureDevExtent', res),
            this.calculateData('lnhoExtent1', res),
          ],
          backgroundColor: [
            'rgba(255, 99, 132)', // Red
            'rgba(54, 162, 235)', // Blue
            'rgba(255, 206, 86)', // Yellow
            'rgba(75, 192, 192)', // Teal
            'rgba(153, 102, 255)', // Purple
            'rgba(255, 159, 64)', // Orange
            'rgba(201, 203, 207)', // Grey
            'rgba(102, 205, 170)', // Medium Aquamarine
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)', // Red
            'rgba(54, 162, 235, 1)', // Blue
            'rgba(255, 206, 86, 1)', // Yellow
            'rgba(75, 192, 192, 1)', // Teal
            'rgba(153, 102, 255, 1)', // Purple
            'rgba(255, 159, 64, 1)', // Orange
            'rgba(201, 203, 207, 1)', // Grey
            'rgba(102, 205, 170, 1)', // Medium Aquamarine
          ],
          borderWidth: 1,
        },
      ],
    };

    this.options1 = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }

  ptoBarChart(res: any) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data4 = {
      labels: ['Utilised', 'Non Utilised', 'Land Available'],
      datasets: [
        {
          label: 'Acres',
          data: [
            this.calculateData('utilisedExtent', res),
            this.calculateData('notUtilisedExtent', res),
            this.calculateData('futureDevExtent', res),
          ],
          backgroundColor: [
            'rgba(153, 102, 255)', // Purple
            'rgba(255, 159, 64)', // Orange
            'rgba(201, 203, 207)', // Grey
          ],
          borderColor: [
            'rgba(153, 102, 255, 1)', // Purple
            'rgba(255, 159, 64, 1)', // Orange
            'rgba(201, 203, 207, 1)', // Grey
          ],
          borderWidth: 1,
        },
      ],
    };

    this.options4 = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }

  underLitigationBarChart(res: any) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data5 = {
      labels: [
        'Court Case',
        'Lack of Approach',
        'Encroachment',
        'Scattered',
        'Quashed',
        'Reconveyed',
        'NOC',
        'Govt Depts',
        'Others',
      ],
      datasets: [
        {
          label: 'Acres',
          data: [
            this.calculateData('Court_Case', res),
            this.calculateData('Lack_of_Approach', res),
            this.calculateData('Encroachment', res),
            this.calculateData('Scattered', res),
            this.calculateData('Quashed', res),
            this.calculateData('Reconveyed', res),
            this.calculateData('NOC', res),
            this.calculateData('Govt_Depts', res),
            this.calculateData('Others', res),
          ],
          backgroundColor: [
            'rgba(255, 99, 132)', // Red
            'rgba(54, 162, 235)', // Blue
            'rgba(255, 206, 86)', // Yellow
            'rgba(75, 192, 192)', // Teal
            'rgba(153, 102, 255)', // Purple
            'rgba(255, 159, 64)', // Orange
            'rgba(201, 203, 207)', // Grey
            'rgba(102, 205, 170)', // Medium Aquamarine
            'rgb(238, 223, 122)',
          ],
          borderColor: [
            'rgba(255, 99, 132)', // Red
            'rgba(54, 162, 235)', // Blue
            'rgba(255, 206, 86)', // Yellow
            'rgba(75, 192, 192)', // Teal
            'rgba(153, 102, 255)', // Purple
            'rgba(255, 159, 64)', // Orange
            'rgba(201, 203, 207)', // Grey
            'rgba(102, 205, 170)', // Medium Aquamarine
            'rgb(238, 223, 122)',
          ],
          borderWidth: 1,
        },
      ],
    };

    this.options5 = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }

  releasedBarChart(res?: any) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data7 = {
      labels: [
        '4(1)',
        'Released between 4(1) and 6dd',
        '6dd',
        'Released between 6dd and award',
      ],
      datasets: [
        {
          label: 'Acres',
          data: [55, 78, 11, 67],
          backgroundColor: [
            'rgba(153, 102, 255)', // Purple
            'rgba(255, 159, 64)', // Orange
            'rgba(201, 203, 207)', // Grey
            'rgba(255, 99, 132, 1)',
          ],
          borderColor: [
            'rgba(153, 102, 255, 1)', // Purple
            'rgba(255, 159, 64, 1)', // Orange
            'rgba(201, 203, 207, 1)', // Grey
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    this.options7 = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }

  landAvailablePieChart(res: any) {
    this.data2 = {
      labels: ['Possession Taken Over', 'Land Available'],
      datasets: [
        {
          data: [
            this.calculateData('lhoExtent1', res),
            this.calculateData('futureDevExtent', res),
          ],
          backgroundColor: ['rgba(75, 192, 192)', 'rgba(201, 203, 207)'],
          hoverBackgroundColor: ['rgba(75, 192, 192)', 'rgba(201, 203, 207)'],
        },
      ],
    };

    this.options2 = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: '#000000',
          },
        },
      },
    };
  }

  ptoPntoChart(res: any) {
    this.data3 = {
      labels: ['Possession Taken Over', 'Possession Not Taken Over'],
      datasets: [
        {
          data: [
            this.calculateData('lhoExtent1', res),
            this.calculateData('lnhoExtent1', res),
          ],
          backgroundColor: ['rgba(75, 192, 192)', 'rgba(102, 205, 170)'],
          hoverBackgroundColor: ['rgba(75, 192, 192)', 'rgba(102, 205, 170)'],
        },
      ],
    };

    this.options3 = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            color: '#000000',
          },
        },
      },
    };
  }

  awardAmountChart(res?: any) {
    this.data6 = {
      labels: ['Court Case', 'Revenue Deposit', 'Direct Payment'],
      datasets: [
        {
          data: [35, 60, 70],
          backgroundColor: [
            'rgba(75, 192, 192)',
            'rgba(102, 205, 170)',
            'rgba(153, 102, 255)',
          ],
          hoverBackgroundColor: [
            'rgba(75, 192, 192)',
            'rgba(102, 205, 170)',
            'rgba(153, 102, 255)',
          ],
        },
      ],
    };

    this.options6 = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            color: '#000000',
          },
        },
      },
    };
  }
}
