import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataFeederService } from './data-feeder.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  oderDetails: Array<any> = [];
  selectedRows: Array<any> = [];
  isAllSelected: boolean = false;
  filteredData: Array<any> = [];
  allStatus: any = [];
  allDistribution: any = [];

  @ViewChild('searchvalue') searchedvalue!: ElementRef;
  @ViewChild('status', { static: false }) appliedStatus!: ElementRef;
  @ViewChild('distribution') appliedDistribution!: ElementRef;
  constructor(private dataFeeder: DataFeederService) {}

  ngOnInit() {
    this.dataFeeder.getOrder().subscribe({
      next: (res:any) => {
        this.oderDetails = res;
        this.allStatus = this.getUniqueValues(this.oderDetails, 'status');
        this.allDistribution = this.getUniqueValues(this.oderDetails, 'distribution');
        this.filteredData = [...this.oderDetails];
      },
      error: (err) => {
        console.log('Error occured while fetching api', err);
      },
    });
  }

  selectRow(rowDetails: any, event: any) {
    if (event.target.checked) {
      this.selectedRows.push(rowDetails);
    } else {
      let getIndex = this.selectedRows.findIndex((ele) => {
        return ele.refId === rowDetails.refId;
      });
      this.selectedRows.splice(getIndex, 1);
    }
  }
  selectAllRow(event: any) {
    if (event.target.checked) {
      this.selectedRows = [...this.oderDetails];
      this.isAllSelected = true;
    } else {
      this.selectedRows = [];
      this.isAllSelected = false;
    }
  }

  export() {
    console.log(this.selectedRows);
  }

  filter() {
    let searchString:any;
    if(this.searchedvalue.nativeElement.value && this.searchedvalue.nativeElement.value!=''){
      searchString = this.searchedvalue.nativeElement.value;
    }
    if(this.appliedStatus.nativeElement.value && this.appliedStatus.nativeElement.value!="null"){
      searchString = this.appliedStatus.nativeElement.value;
    }
    if(this.appliedDistribution.nativeElement.value && this.appliedDistribution.nativeElement.value!="null"){
      searchString = this.appliedDistribution.nativeElement.value;
    }
    console.log(searchString)
    if (
      !searchString || searchString==''
    ) {
      this.filteredData = [...this.oderDetails];
      return;
    }
    searchString = searchString.toLowerCase();

    this.filteredData = this.oderDetails.filter((item) => {
      for (const key in item) {
        if (item.hasOwnProperty(key) && typeof item[key] === 'string') {
          const value = item[key].toLowerCase();
          if (value.includes(searchString)) {
            return true;
          }
        }
      }
      return false;
    });
    console.log(this.filteredData);
  }

  getUniqueValues(data: any, field: any) {
    const uniqueValues = [];
    const encounteredValues = new Set();

    for (const item of data) {
      const value = item[field];
      if (!encounteredValues.has(value)) {
        encounteredValues.add(value);
        uniqueValues.push(value);
      }
    }

    return uniqueValues;
  }
  
  downloadExcel() {
    const jsonArray = this.oderDetails;

    const worksheet = XLSX.utils.json_to_sheet(jsonArray);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate an XLSX binary string
    const excelBinaryString = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

    // Convert the binary string to a Blob
    const blob = new Blob([s2ab(excelBinaryString)], { type: 'application/octet-stream' });

    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = 'Orders.xlsx';
    a.click();

    URL.revokeObjectURL(blobUrl);
  }
}

function s2ab(s: string): ArrayBuffer {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xff;
  }
  return buf;
}
