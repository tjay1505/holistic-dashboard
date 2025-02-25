import { ApiService } from './../services/api.service';
import { Component } from '@angular/core';
import { ChartConfiguration, ChartDataset } from 'chart.js';
import { Chart, registerables } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { SharedModule, MenuItem } from 'primeng/api';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { SpinnerModule } from 'primeng/spinner';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { finalize, Observable } from 'rxjs';

Chart.register(ChartDataLabels);

@Component({
  selector: 'app-payroll2',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
    BreadcrumbModule,
    CardModule,
    DropdownModule,
    NgxSpinnerModule,
    FormsModule,
    ChartModule,
  ],
  templateUrl: './payroll2.component.html',
  styleUrl: './payroll2.component.scss',
})
export class Payroll2Component {
  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  earningChart: Chart | undefined;
  earningChart1: Chart | undefined;
  earningChart2: Chart | undefined;
  earningChart3: Chart | undefined;
  earningChart4: Chart | undefined;
  advanceChart: Chart | undefined;
  earningData: any[] = [];
  disabilityData: number[] = [12, 120];
  disabilityData1: number[] = [];
  deductionChart1: Chart<'pie', number[], unknown> | undefined;
  deductionChart: Chart<'pie', number[], unknown> | undefined;
  employeeCount: any;
  totalEarnings: any;
  totalDeduction: any;
  totalPay: any;
  paymentStatusYesCount: any;
  paymentStatusNoCount: any;
  totalGpf: any;
  totalCps: any;
  totalVpf: any;
  totalFbf: any;
  totalSpecialpf: any;
  totalNhis: any;
  totalGpfLoan: any;
  totalFestivalAdvance: any;
  totalMedicalAdvance: any;
  totalHBA: any;
  designation: any;
  totalHbf: any;
  professionalTax: any;
  incometax: any;
  incometaxcess: any;
  totalEoe: any;
  gpfArrear: any;
  conveyanceAdance: any;
  educationAdvance: any;
  marriageAdavacce: any;
  payAdvance: any;
  misc1: any;
  misc2: any;
  misc3: any;
  misc4: any;
  lic: any;
  society: any;
  standardDeduction: any;
  advanceDeduction: any;
  officecode: any;
  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  monthMapping: { [key: string]: number } = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };
  selectedMonth: string | null = null;
  years: number[] = [];
  selectedYear: number | null = null;
  selectedOfficeCodes: string[] = []; // Store selected office codes
  selectedDesignationCodes: string[] = []; // Store selected designation codes

  topBoxValue: {
    tittle: any;
    options: boolean;
    val: any;
    clr: any;
    icon: any;
  }[] = [
    {
      tittle: 'Total Employee',
      val: '0.00',
      options: false,
      clr: 'linear-gradient(90deg, rgb(134, 139, 29), rgb(217, 229, 150))',
      icon: 'https://cdn-icons-png.flaticon.com/128/18992/18992269.png',
    },
    {
      tittle: 'Total Earnings ',
      val: '0.00',
      options: true,
      clr: 'linear-gradient(90deg, rgb(26, 26, 62), rgb(113, 118, 242))',
      icon: 'https://cdn-icons-png.flaticon.com/128/11476/11476545.png',
    },
    {
      tittle: 'Total Deductions ',
      val: '0.00',
      options: true,
      clr: 'linear-gradient(90deg, rgb(234, 62, 56), rgb(255, 205, 148))',
      icon: 'https://cdn-icons-png.flaticon.com/128/12866/12866223.png',
    },
    {
      tittle: 'Net Pay',
      val: '0.00',
      options: true,
      clr: 'linear-gradient(90deg, rgb(15, 149, 0), rgb(169, 248, 155))',
      icon: 'https://cdn-icons-png.flaticon.com/128/3359/3359235.png',
    },
  ];

  upDateTopBoxValue(data: any) {
    this.topBoxValue[0].val = this.employeeCount;
    this.topBoxValue[1].val = this.totalEarnings;
    this.topBoxValue[2].val = this.totalDeduction;
    this.topBoxValue[3].val = this.totalPay;
  }

  constructor(
    private apiCall: ApiService,
    private spinner: NgxSpinnerService
  ) {}
  private handleSpinner<T>(observable: Observable<T>): Observable<T> {
    this.spinner.show();
    return observable.pipe(finalize(() => this.spinner.hide()));
  }
  async ngOnInit(): Promise<void> {
    this.items = [{ label: 'Pay Roll' }];
    this.home = { icon: 'pi pi-home' };
    //console.log('callingggggggg');
    await this.getAllData();
    await this.getSummary();
    // this.initemployeeSalary()
    // this.initpaymentStaus()
    // this.initEarningChart()
    // this.initdeductionChart()
    // this.initstandardDeduction()
    this.initAdvanceDeduction();
    // this.initSanctionChart()
    this.populateYears();
    this.getOfficeCode();
    this.getDesignation();
    console.log('ngOnInit completed');
  }
  populateYears(): void {
    const currentYear = new Date().getFullYear();
    const startYear = 2024; // Starting year for the dropdown
    this.years = [];

    for (let year = startYear; year <= currentYear; year++) {
      this.years.push(year);
    }
  }

  initemployeeSalary(): void {
    const canvasBar = document.getElementById(
      'genderChart1'
    ) as HTMLCanvasElement;
    if (!canvasBar) {
      console.error('Canvas element not found');
      return;
    }

    const ctxBar = canvasBar.getContext('2d');
    if (!ctxBar) {
      console.error('Failed to get canvas context');
      return;
    }

    // Labels and their corresponding data
    const labelsBar = ['Total Earnings', 'Total Deductions', 'NetPay'];
    const dataBarValues = [
      this.totalEarnings,
      this.totalDeduction,
      this.totalPay,
    ]; // Dynamic data
    const backgroundColors = ['#A7D5F2', '#F2C6C2', '#F7E7A9'];

    const dataBar = {
      labels: labelsBar,
      datasets: [
        {
          data: dataBarValues, // Dynamic data
          backgroundColor: backgroundColors,
          borderWidth: 1, // Optional: Add border width if needed
        },
      ],
    };

    console.log('Salary breakdown chart data', dataBar);

    const configBar: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: dataBar,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false, // Hide legend as each bar represents its own category
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                // Custom label for each bar in the tooltip
                const label = labelsBar[tooltipItem.dataIndex]; // Get the label for the bar
                const value = tooltipItem.raw; // Get the value
                return `${label}: ${value}`; // Display label and value
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Category', // Updated x-axis title
            },
          },
          y: {
            title: {
              display: true,
              text: 'Amount', // Updated y-axis title
            },
            beginAtZero: true,
          },
        },
      },
    };

    if (this.earningChart) {
      this.earningChart.destroy();
    }

    console.log('Creating salary breakdown bar chart');
    this.earningChart = new Chart(ctxBar, configBar);
  }
  initDeduction() {
    const canvasPie = document.getElementById(
      'disabilityChart1'
    ) as HTMLCanvasElement;
    if (!canvasPie) {
      console.error('Canvas element not found');
      return;
    }

    const ctxPie = canvasPie.getContext('2d');
    if (!ctxPie) {
      console.error('Failed to get canvas context');
      return;
    }

    const labelsPie = ['Standard Deduction', 'Advance Deduction'];
    const dataPie = {
      labels: labelsPie,
      datasets: [
        {
          label: 'Period',
          data: this.disabilityData,
          backgroundColor: ['#D6C6E1', '#FADADD'],
        },
      ],
    };
    console.log('deduction', dataPie);

    const configPie: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: dataPie,
    };

    // Destroy the previous disabilityChart if it exists
    if (this.deductionChart1) {
      this.deductionChart1.destroy();
    }

    // Initialize a new chart for disability
    this.deductionChart1 = new Chart(ctxPie, configPie);
  }
  initpaymentStaus() {
    const canvasPie = document.getElementById(
      'paymentStatus'
    ) as HTMLCanvasElement;
    if (!canvasPie) {
      console.error('Canvas element not found');
      return;
    }

    const ctxPie = canvasPie.getContext('2d');
    if (!ctxPie) {
      console.error('Failed to get canvas context');
      return;
    }

    const labelsPie = ['Yes', 'No'];
    const dataPie = {
      labels: labelsPie,
      datasets: [
        {
          label: 'Period',
          data: this.disabilityData1,
          backgroundColor: ['#B9E5C7', '#F7E7A9'],
        },
      ],
    };
    console.log('deduction', dataPie);

    const configPie: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: dataPie,
    };

    // Destroy the previous disabilityChart if it exists
    if (this.deductionChart) {
      this.deductionChart.destroy();
    }

    // Initialize a new chart for disability
    this.deductionChart = new Chart(ctxPie, configPie);
  }
  initEarningChart(earningData: number[]): void {
    const canvasBar = document.getElementById(
      'vendingBusinessName1'
    ) as HTMLCanvasElement;
    if (!canvasBar) {
      console.error('Canvas element not found');
      return;
    }

    const ctxBar = canvasBar.getContext('2d');
    if (!ctxBar) {
      console.error('Failed to get canvas context');
      return;
    }

    // Labels for the chart
    const labelsBar = [
      'Basic Pay',
      'Special Pay',
      'Personal Pay',
      'DA',
      'HRA',
      'CCA',
      'FTA',
      'Hill Allowance',
      'Winter Allowance',
      'Washing Allowance',
      'Conveyance Allowance',
      'Cash Allowance',
      'Medical Allowance',
      'Interim Relief',
      'Misc1',
    ];

    const backgroundColors = '#FFCDD2'; // Single color for all bars

    const dataBar = {
      labels: labelsBar,
      datasets: [
        {
          data: earningData, // Dynamic data
          backgroundColor: backgroundColors,
          borderWidth: 1,
        },
      ],
    };

    console.log('Earning Chart Data', dataBar);

    const configBar: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: dataBar,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false, // Each bar represents a separate category
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const label = labelsBar[tooltipItem.dataIndex]; // Get the label for the bar
                const value = tooltipItem.raw; // Get the value
                return `${label}: ₹${value}`; // Display label and value
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Earnings',
            },
            ticks: {
              autoSkip: false,
              maxRotation: 45,
              minRotation: 45,
            },
          },
          y: {
            title: {
              display: true,
              text: 'Amount (in ₹)',
            },
            beginAtZero: true,
          },
        },
      },
    };

    if (this.earningChart1) {
      this.earningChart1.destroy();
    }

    console.log('Creating Earning Chart');
    this.earningChart1 = new Chart(ctxBar, configBar);
  }
  initdeductionChart(): void {
    const canvasBar = document.getElementById('deduction') as HTMLCanvasElement;
    if (!canvasBar) {
      console.error('Canvas element not found');
      return;
    }

    const ctxBar = canvasBar.getContext('2d');
    if (!ctxBar) {
      console.error('Failed to get canvas context');
      return;
    }

    // Labels and their corresponding data
    const labelsBar = [
      'GPF',
      'CPS',
      'VPF',
      'FBF',
      'HBA',
      'HBF',
      'Professional Tax',
      'Income Tax',
      'IncomeTax cess',
      'EoE',
      'GPF Arrear',
      'Conveyance Advance',
      'Education Advance',
      'Marriage Advance',
      'Pay Advance',
      'Misc-1',
      'Misc-2',
      'Misc-3',
      'Misc-4',
      'LIC',
      'Society',

      'SPF',
      'NHIS',
      'GPF Loan',
      'Festival Advance',
      'Medical Advance',
    ];
    const dataBarValues = [
      this.totalGpf,
      this.totalCps,
      this.totalVpf,
      this.totalFbf,
      this.totalSpecialpf,
      this.totalNhis,
      this.totalGpfLoan,
      this.totalFestivalAdvance,
      this.totalHBA,
      this.totalHbf,
      this.professionalTax,
      this.incometax,
      this.incometaxcess,
      this.totalEoe,
      this.gpfArrear,
      this.conveyanceAdance,
      this.educationAdvance,
      this.marriageAdavacce,
      this.payAdvance,
      this.misc1,
      this.misc2,
      this.misc3,
      this.misc4,
      this.lic,
      this.society,
    ];
    const backgroundColors = '#FFCDD2'; // Single color for all bars

    const dataBar = {
      labels: labelsBar,
      datasets: [
        {
          data: dataBarValues, // Dynamic data
          backgroundColor: backgroundColors,
          borderWidth: 1, // Optional: Add border width if needed
        },
      ],
    };

    console.log('Deduction chart data', dataBar);

    const configBar: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: dataBar,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false, // Hide legend as each bar represents its own category
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                // Custom label for each bar in the tooltip
                const label = labelsBar[tooltipItem.dataIndex]; // Get the label for the bar
                const value = tooltipItem.raw; // Get the value
                return `${label}: ₹${value}`; // Display label and value
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Deductions', // Updated x-axis title
            },
            ticks: {
              autoSkip: false, // Show all labels
              maxRotation: 45, // Rotate labels for better readability
              minRotation: 45,
            },
          },
          y: {
            title: {
              display: true,
              text: 'Amount (in ₹)', // Updated y-axis title
            },
            beginAtZero: true,
          },
        },
      },
    };

    if (this.earningChart2) {
      this.earningChart2.destroy();
    }

    console.log('Creating deduction breakdown bar chart');
    this.earningChart2 = new Chart(ctxBar, configBar);
  }
  initstandardDeduction(): void {
    const canvasBar = document.getElementById(
      'familyEducation1'
    ) as HTMLCanvasElement;
    if (!canvasBar) {
      console.error('Canvas element not found');
      return;
    }

    const ctxBar = canvasBar.getContext('2d');
    if (!ctxBar) {
      console.error('Failed to get canvas context');
      return;
    }

    // Labels and their corresponding data
    const labelsBar = [
      'GPF',
      'CPS',
      'VPF',
      'FBF',
      'SPF',
      'NHIS',
      'Professional Tax',
      'Income Tax',
      'Income Tax cess',
      'EoE',
      'Misc-3',
      'Misc-4',
    ];
    const dataBarValues = [
      this.totalGpf,
      this.totalCps,
      this.totalVpf,
      this.totalFbf,
      this.totalSpecialpf,
      this.totalNhis,
      this.professionalTax,
      this.incometax,
      this.incometaxcess,
      this.totalEoe,
      this.misc3,
      this.misc4,
    ]; // Replace with your dynamic data
    const backgroundColors = '#A7D5F2'; // Single color for all bars, as in the image

    const dataBar = {
      labels: labelsBar,
      datasets: [
        {
          data: dataBarValues, // Dynamic data
          backgroundColor: backgroundColors,
          borderWidth: 1, // Optional: Add border width if needed
        },
      ],
    };

    console.log('Salary breakdown chart data', dataBar);

    const configBar: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: dataBar,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false, // Hide legend as each bar represents its own category
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                // Custom label for each bar in the tooltip
                const label = labelsBar[tooltipItem.dataIndex]; // Get the label for the bar
                const value = tooltipItem.raw; // Get the value
                return `${label}: ${value}`; // Display label and value
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Deductions', // Updated x-axis title
            },
            ticks: {
              autoSkip: false, // Show all labels
              maxRotation: 45, // Rotate labels for better readability
              minRotation: 45,
            },
          },
          y: {
            title: {
              display: true,
              text: 'Amount (in ₹)', // Updated y-axis title
            },
            beginAtZero: true,
          },
        },
      },
    };

    if (this.earningChart3) {
      this.earningChart3.destroy();
    }

    console.log('Creating salary breakdown bar chart');
    this.earningChart3 = new Chart(ctxBar, configBar);
  }

  initAdvanceDeduction(): void {
    const canvasBar = document.getElementById(
      'familyDisability1'
    ) as HTMLCanvasElement;
    if (!canvasBar) {
      console.error('Canvas element not found');
      return;
    }

    const ctxBar = canvasBar.getContext('2d');
    if (!ctxBar) {
      console.error('Failed to get canvas context');
      return;
    }

    // Labels and their corresponding data
    const labelsBar = [
      'HBA',
      'HBF',
      'GPF Loan',
      'GPF Arrear',
      'Conveyance Advance',
      'Education Advance',
      'Marriage Advance',
      'Pay Advance',
      'LIC',
      'Society',
      'Misc-1',
      'Misc-2',
      'Festival Advance',
    ];
    const dataBarValues = [
      this.totalHBA,
      this.totalHbf,
      this.totalGpfLoan,
      this.gpfArrear,
      this.conveyanceAdance,
      this.educationAdvance,
      this.marriageAdavacce,
      this.payAdvance,
      this.lic,
      this.society,
      this.misc1,
      this.misc2,
      this.totalFestivalAdvance,
    ]; // Replace with your dynamic data
    const backgroundColors = '#A7D5F2'; // Single color for all bars, as in the image

    const dataBar = {
      labels: labelsBar,
      datasets: [
        {
          data: dataBarValues, // Dynamic data
          backgroundColor: backgroundColors,
          borderWidth: 1, // Optional: Add border width if needed
        },
      ],
    };

    console.log('Salary breakdown chart data', dataBar);

    const configBar: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: dataBar,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false, // Hide legend as each bar represents its own category
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                // Custom label for each bar in the tooltip
                const label = labelsBar[tooltipItem.dataIndex]; // Get the label for the bar
                const value = tooltipItem.raw; // Get the value
                return `${label}: ${value}`; // Display label and value
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Deductions', // Updated x-axis title
            },
            ticks: {
              autoSkip: false, // Show all labels
              maxRotation: 45, // Rotate labels for better readability
              minRotation: 45,
            },
          },
          y: {
            title: {
              display: true,
              text: 'Amount (in ₹)', // Updated y-axis title
            },
            beginAtZero: true,
          },
        },
      },
    };

    if (this.earningChart4) {
      this.earningChart4.destroy();
    }

    console.log('Creating salary breakdown bar chart');
    this.earningChart4 = new Chart(ctxBar, configBar);
  }

  initSanctionChart(apiResponse: any): void {
    const canvas = document.getElementById('deduction1') as HTMLCanvasElement;
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    // Labels for categories
    const labels = [
      'Festival Advance',
      'Conveyance Advance',
      'Education Advance',
      'Marriage Advance',
      'Pay Advance',
      'HBA',
      'CPS Arrear',
      'Misc-1',
      'Misc-2',
      'GPF Loan',
      'GPF Arrear',
    ];

    // Extract data from API response
    const sanctionedData = [
      apiResponse.totalFestivalAdvanceSaction || 0,
      apiResponse.totalConveyanceAdvanceSaction || 0,
      apiResponse.totalEducationAdvanceSaction || 0,
      apiResponse.totalMarriageAdvanceSaction || 0,
      apiResponse.totalPayAdvanceSaction || 0,
      apiResponse.totalHbaSaction || 0,
      apiResponse.totalCpsArrearSaction || 0,
      apiResponse.totalMisc1AdvanceSaction || 0,
      apiResponse.totalMisc2AdvanceSaction || 0,
      apiResponse.totalGpfLoanAdvanceSancation || 0,
      apiResponse.totalGpfArrearAdvanceSancation || 0,
    ];

    const recoveredData = [
      apiResponse.totalFestivalAdvance || 0,
      apiResponse.totalConveyanceAdvance || 0,
      apiResponse.totalEducationAdvance || 0,
      apiResponse.totalMarriageAdvance || 0,
      apiResponse.totalPayAdvance || 0,
      apiResponse.totalHba || 0,
      apiResponse.totalCpsArrear || 0,
      apiResponse.totalMisc1Advance || 0,
      apiResponse.totalMisc2Advance || 0,
      apiResponse.totalGpfLoanAdvance || 0,
      apiResponse.totalGpfArrearAdvance || 0,
    ];

    const balanceData = [
      apiResponse.totalFestivalAdvanceBalance || 0,
      apiResponse.totalConveyanceAdvanceBalance || 0,
      apiResponse.totalEducationAdvanceBalance || 0,
      apiResponse.totalMarriageAdvanceBalance || 0,
      apiResponse.totalPayAdvanceBalance || 0,
      apiResponse.totalHbaBalance || 0,
      apiResponse.totalCpsArrearBalance || 0,
      apiResponse.totalMisc1AdvanceBalance || 0,
      apiResponse.totalMisc2AdvanceBalance || 0,
      apiResponse.totalGpfLoanAdvanceBalance || 0,
      apiResponse.totalGpfArrearAdvanceBalance || 0,
    ];

    // Chart datasets
    const datasets: ChartDataset<'bar'>[] = [
      {
        label: 'Sanctioned',
        data: sanctionedData,
        backgroundColor: '#A7C7F8', // Blue
      },
      {
        label: 'Recovered',
        data: recoveredData,
        backgroundColor: '#F4A9A3', // Red
      },
      {
        label: 'Balance',
        data: balanceData,
        backgroundColor: '#FDE49C', // Yellow
      },
    ];
    console.log('Sanction chart data', datasets);

    // Chart configuration
    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        indexAxis: 'y', // Horizontal bars
        plugins: {
          legend: {
            position: 'top', // Legend position
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const value = tooltipItem.raw as number;
                return `${
                  tooltipItem.dataset.label
                }: ₹${value.toLocaleString()}`;
              },
            },
          },
          datalabels: {
            anchor: 'end', // Positioning of labels
            align: 'end', // Aligning the labels
            formatter: (value) => `₹${value.toLocaleString()}`, // Formatting numbers with ₹
            color: 'black', // Label color
            font: {
              size: 8,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Amount (in ₹)',
            },
            beginAtZero: true,
          },
          y: {
            title: {
              display: true,
              text: 'Advances',
            },
          },
        },
      },
    };

    // Destroy existing chart if present
    if (this.advanceChart) {
      this.advanceChart.destroy();
    }
    this.upDateTopBoxValue('f');
    // Create the chart
    this.advanceChart = new Chart(ctx, config);
  }
  // getAllData():Promise<void> {
  getAllData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.handleSpinner(this.apiCall.getALLDashboard()).subscribe({
        next: (data) => {
          //debugger;
          console.log('API Response Data', data);

          // Store API response data in variables
          this.employeeCount = data.totalEmployeeCount;
          this.totalEarnings = data.totalEarnings;
          this.totalDeduction = data.totalDeductions;
          this.totalPay = data.totalNetpay;
          this.upDateTopBoxValue('f');
          this.paymentStatusYesCount = data.paymentStatusYesCount;
          this.paymentStatusNoCount = data.paymentStatusNoCount;
          this.disabilityData1 = [
            this.paymentStatusYesCount,
            this.paymentStatusNoCount,
          ];

          // Specific chart data
          this.earningData = [
            data.totalBasicPay,
            data.totalSpecialPay,
            data.totalPersonalPay,
            data.totalDa,
            data.totalHra,
            data.totalCca,
            data.totalFta,
            data.totalHillAllowance,
            data.totalWinterAllowance,
            data.totalWashingAllowance,
            data.totalConveyanceAllowance,
            data.totalCashAllowance,
            data.totalMedicalAllowance,
            data.totalInterimRelief,
            data.totalMisc1,
          ];

          // Assign API response values to variables
          this.totalGpf = data.totalGpf || 0;
          this.totalCps = data.totalCps || 0;
          this.totalVpf = data.totalVpf || 0;
          this.totalFbf = data.totalFbf || 0;
          this.totalSpecialpf = data.totalSpecialpf || 0;
          this.totalNhis = data.totalNhis || 0;
          this.totalGpfLoan = data.totalgpfloan || 0;
          this.totalFestivalAdvance = data.totalFestivalAdvance || 0;
          this.totalMedicalAdvance = data.totalMedicalAllowance || 0;
          this.totalHBA = data.totalHba || 0;
          this.totalHbf = data.totalHbf || 0;
          this.professionalTax = data.totalProfessionalTax || 0;
          this.incometax = data.totalIncometax || 0;
          this.incometaxcess = data.totalIncometaxCess || 0;
          this.totalEoe = data.totalEoe || 0;
          this.gpfArrear = data.totalgpfarrear || 0;
          this.conveyanceAdance = data.totalConveyanceAdvance || 0;
          this.educationAdvance = data.totalEducationAdvance || 0;
          this.marriageAdavacce = data.totalMarriageAdvance || 0;
          this.payAdvance = data.totalPayAdvance || 0;
          this.misc1 = data.totalMiscellous1 || 0;
          this.misc2 = data.totalMiscellous2 || 0;
          this.misc3 = data.totalMiscellous3 || 0;
          this.misc4 = data.totalMiscellous4 || 0;
          this.lic = data.totalLic || 0;
          this.society = data.totalSociety || 0;

          // Calculate total standard deduction
          this.standardDeduction = data.standardDeduction;

          console.log('Total Standard Deduction:', this.standardDeduction);
          this.advanceDeduction = data.advanceDeduction;
          console.log('Total advance Deduction:', this.advanceDeduction);
          this.disabilityData = [this.standardDeduction, this.advanceDeduction];
          // Initialize charts with the updated data
          this.initemployeeSalary();
          this.initEarningChart(this.earningData);
          this.initpaymentStaus();
          this.initdeductionChart();
          this.initstandardDeduction();
          this.initDeduction();

          resolve();
        },
        error: (err) => {
          console.error('Error fetching data', err);
          reject(err);
        },
      });
    });
  }

  // Track selected office codes
  onOfficeCodeChange(event: any): void {
    this.selectedOfficeCodes = event.value;
    console.log('Selected Office Codes:', this.selectedOfficeCodes);
    this.applyFilters();
  }

  // Track selected designation codes
  onDesignationCodeChange(event: any): void {
    this.selectedDesignationCodes = event.value;
    console.log('Selected Designation Codes:', this.selectedDesignationCodes);
    this.applyFilters();
  }

  // Track selected month
  onMonthChange(event: any): void {
    this.selectedMonth = event.value;
    console.log('Selected Month:', this.selectedMonth);

    this.applyFilters();
    this.getSummary_filter();
  }

  // Track selected year
  onYearChange(event: any): void {
    this.selectedYear = event.value;
    console.log('Selected Year:', this.selectedYear);
    this.applyFilters();
    this.getSummary_filter();
  }

  // Apply filters
  applyFilters(): void {
    console.log('Applying filters...');
    console.log('Office Codes:', this.selectedOfficeCodes);
    console.log('Designation Codes:', this.selectedDesignationCodes);
    console.log('Month:', this.selectedMonth);
    console.log('Year:', this.selectedYear);

    // Check if any filters are applied
    const isAnyFilterApplied =
      (this.selectedOfficeCodes && this.selectedOfficeCodes.length > 0) ||
      (this.selectedDesignationCodes &&
        this.selectedDesignationCodes.length > 0) ||
      this.selectedMonth ||
      this.selectedYear;

    if (!isAnyFilterApplied) {
      // No filters applied, call the method to fetch all data
      this.getAllData();
      return;
    }

    // Call the API with selected filter values
    this.handleSpinner(
      this.apiCall.getALLDashboard_filter(
        this.selectedOfficeCodes,
        this.selectedDesignationCodes,
        this.selectedMonth,
        this.selectedYear
      )
    ).subscribe({
      next: (data) => {
        console.log('Filtered Data:', data);

        // Update the data variables with API response
        this.employeeCount = data.totalEmployeeCount;
        this.totalEarnings = data.totalEarnings;
        this.totalDeduction = data.totalDeductions;
        this.totalPay = data.totalNetpay;
        this.upDateTopBoxValue('f');
        this.paymentStatusYesCount = data.paymentStatusYesCount;
        this.paymentStatusNoCount = data.paymentStatusNoCount;
        this.disabilityData1 = [
          this.paymentStatusYesCount,
          this.paymentStatusNoCount,
        ];

        // Specific chart data
        this.earningData = [
          data.totalBasicPay,
          data.totalSpecialPay,
          data.totalPersonalPay,
          data.totalDa,
          data.totalHra,
          data.totalCca,
          data.totalFta,
          data.totalHillAllowance,
          data.totalWinterAllowance,
          data.totalWashingAllowance,
          data.totalConveyanceAllowance,
          data.totalCashAllowance,
          data.totalMedicalAllowance,
          data.totalInterimRelief,
          data.totalMisc1,
        ];

        // Assign API response values to variables
        this.totalGpf = data.totalGpf || 0;
        this.totalCps = data.totalCps || 0;
        this.totalVpf = data.totalVpf || 0;
        this.totalFbf = data.totalFbf || 0;
        this.totalSpecialpf = data.totalSpecialpf || 0;
        this.totalNhis = data.totalNhis || 0;
        this.totalGpfLoan = data.totalgpfloan || 0;
        this.totalFestivalAdvance = data.totalFestivalAdvance || 0;
        this.totalMedicalAdvance = data.totalMedicalAllowance || 0;
        this.totalHBA = data.totalHba || 0;
        this.totalHbf = data.totalHbf || 0;
        this.professionalTax = data.totalProfessionalTax || 0;
        this.incometax = data.totalIncometax || 0;
        this.incometaxcess = data.totalIncometaxCess || 0;
        this.totalEoe = data.totalEoe || 0;
        this.gpfArrear = data.totalgpfarrear || 0;
        this.conveyanceAdance = data.totalConveyanceAdvance || 0;
        this.educationAdvance = data.totalEducationAdvance || 0;
        this.marriageAdavacce = data.totalMarriageAdvance || 0;
        this.payAdvance = data.totalPayAdvance || 0;
        this.misc1 = data.totalMiscellous1 || 0;
        this.misc2 = data.totalMiscellous2 || 0;
        this.misc3 = data.totalMiscellous3 || 0;
        this.misc4 = data.totalMiscellous4 || 0;
        this.lic = data.totalLic || 0;
        this.society = data.totalSociety || 0;

        // Calculate total standard deduction
        this.standardDeduction = data.standardDeduction || 0;
        console.log('Total Standard Deduction:', this.standardDeduction);

        this.advanceDeduction = data.advanceDeduction || 0;
        console.log('Total advance Deduction:', this.advanceDeduction);

        this.disabilityData = [this.standardDeduction, this.advanceDeduction];

        // Initialize charts with the updated data
        this.initemployeeSalary();
        this.initEarningChart(this.earningData);
        this.initpaymentStaus();
        this.initdeductionChart();
        this.initstandardDeduction();
        this.initDeduction();
      },
      error: (err) => {
        console.error('Error applying filters:', err);
      },
    });
  }

  getSummary(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.handleSpinner(this.apiCall.getSummary()).subscribe({
        next: (data) => {
          console.log('API summary', data);
          this.initSanctionChart(data); // Call chart initialization with API data
          resolve();
        },
        error: (err) => {
          console.error('Error fetching data', err);
          reject(err);
        },
      });
    });
  }
  getNumericMonth(month: string): number {
    const monthMapping: { [key: string]: number } = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };
    return monthMapping[month];
  }

  getSummary_filter(): Promise<void> {
    console.log('Month (Name):', this.selectedMonth);
    console.log('Year:', this.selectedYear);

    const numericMonth = this.selectedMonth
      ? this.getNumericMonth(this.selectedMonth)
      : null; // Convert to numeric
    console.log('Numeric Month:', numericMonth);

    return new Promise((resolve, reject) => {
      this.handleSpinner(
        this.apiCall.getSummary_filter(numericMonth, this.selectedYear)
      ).subscribe({
        next: (data) => {
          console.log('API Summary:', data);
          this.initSanctionChart(data); // Pass data to chart initialization
          resolve();
        },
        error: (err) => {
          console.error('Error fetching data:', err);
          reject(err);
        },
      });
    });
  }
  //month choose

  getOfficeCode() {
    let payload = {
      id: '123',
    };
    this.handleSpinner(this.apiCall.getOfficecode(payload)).subscribe(
      (data) => {
        console.log('Office code:', data);
        this.officecode = data.data;
        console.log(this.officecode);
      }
    );
    this.upDateTopBoxValue('f');
  }
  getDesignation() {
    let payload = {
      id: '123',
    };
    this.handleSpinner(this.apiCall.getDesignation(payload)).subscribe(
      (data) => {
        console.log('designation code:', data);
        this.designation = data.data;
      }
    );
    this.upDateTopBoxValue('f');
  }
}
