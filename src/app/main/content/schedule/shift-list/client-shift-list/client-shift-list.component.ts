import {
	Component, OnInit,
	ViewEncapsulation, ViewChild,
	ElementRef, Input
} from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material';

import * as _ from 'lodash';
import * as moment from 'moment';

import { Observable } from 'rxjs/Observable';

import { ToastrService } from 'ngx-toastr';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { fuseAnimations } from '../../../../../core/animations';

import { TokenStorage } from '../../../../../shared/services/token-storage.service';
import { ScheduleService } from '../../schedule.service';
import { TabService } from '../../../../tab/tab.service';
import { ActionService } from '../../../../../shared/services/action.service';
import { Tab } from '../../../../tab/tab';

@Component({
    selector: 'app-client-shift-list',
	templateUrl: './client-shift-list.component.html',
    styleUrls: ['./client-shift-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ClientShiftListComponent implements OnInit {
    
    loadingIndicator: boolean = true; // Datatable loading indicator

    shifts: any[];
    selectedShifts: any[] = [];
    columns: any[];
    filters = ["manager:=:1"];
    sorts: any[];

    hiddenColumns = ['id', 'status', 'border_color', 'bg_color', 'font_color'];

    pageNumber: number;
    pageSize = 10;
    total: number;
    pageLengths = [10, 25, 50, 100, 200, 300];

    dialogRef: any;
    differ: any;

    @ViewChild(DatatableComponent) table: DatatableComponent;

    // Initialize date range selector
    period = {
        from: moment().startOf('month').toDate(),
        to: moment().endOf('month').toDate()
    };

    filtersObservable; // Filters

	constructor(
        private toastr: ToastrService,
        private tokenStorage: TokenStorage,
        private scheduleService: ScheduleService,
        private tabService: TabService,
        private actionService: ActionService
    ) { 
    }

	ngOnInit() {
        this.getShifts();
        this.filtersObservable = (text: string): Observable<any> => {
            return this.scheduleService.getWorkAreas(text);
        };
    }
    
    // GET SHIFTS BY FILTERS, PAGE, SORTS
    getShifts(params = null) {
        const query = {
            filters: this.filters,
            pageSize: this.pageSize,
            pageNumber: this.pageNumber,
            sorts: this.sorts,
            from: moment(this.period.from).format('YYYY-MM-DD'),
            to: moment(this.period.to).format('YYYY-MM-DD'),
            ...params
        };

        this.loadingIndicator = true;

        this.scheduleService.getShifts(query).subscribe(
            res => {
                this.loadingIndicator = false;
                this.shifts = res.data;
                this.columns = res.columns;
                this.pageSize = res.page_size;
                this.pageNumber = res.page_number;
                this.total = res.total_counts;
            },
            err => {
                this.loadingIndicator = false;
                if (err.status && err.status === 403) {
                    this.toastr.error('You have no permission!');
                }
            }
        )
    }

    // DATATABLE SORT
    onSort(event) {
        this.sorts = event.sorts.map(v => `${v.prop}:${v.dir}`);
        this.getShifts();
    }

    // DATATABLE PAGINATION
    setPage(pageInfo) {
        this.pageNumber = pageInfo.page - 1;
        this.getShifts();
    }

    // SELECT SHIFTS
    onSelect({ selected }) {
        this.selectedShifts.splice(0, this.selectedShifts.length);
        this.selectedShifts.push(...selected);
    }

    onFiltersChanged(filters) {
        this.filters = filters;
        this.getShifts();
    }

    // PAGE LENGTH SELECTOR
    onPageLengthChange(event) {
        this.getShifts({ pageSize: event.value });
    }

    min(x, y) {
        return Math.min(x, y);
    }

    changeDate(event: MatDatepickerInputEvent<Date>, selector = 'from' || 'to') {
        this.period[selector] = event.value;
        this.getShifts();
    }

}
