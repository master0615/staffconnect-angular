import {
    Component, OnInit, Input,
    IterableDiffers, SimpleChanges,
    OnChanges, Output, EventEmitter,
    ViewChild, OnDestroy
} from '@angular/core';

import { FormControl, Validators } from '@angular/forms'

import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

import { MatSlideToggleChange, MatSelectChange } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { SettingsService } from '../settings.service';

enum Setting {
    user_table_columns = 9
}

@Component({
    selector: 'app-settings-user-table',
    templateUrl: './user-table.component.html',
    styleUrls: ['./user-table.component.scss']
})
export class SettingsUserTableComponent implements OnInit, OnChanges {

    _settings = [];

    @Input('settings')
    set settings(settings) {
        this._settings = settings;
    }

    get settings() {
        return this._settings;
    }

    @Input() options = [];

    @Output() settingsChange = new EventEmitter();

    readonly Setting = Setting;

    items: any = {}; // All Settings

    displayedColumns = [];
    availableColumns = [];

    constructor(
        private settingsService: SettingsService,
        private toastr: ToastrService
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.settings) {
            const keys = Object.keys(this.Setting).filter(v => _.isNaN(_.toNumber(v))) as string[];
            _.forEach(keys, (v) => {
                const item = _.find(this.settings, ['setting', v]);
                if (!_.isUndefined(item)) { // user_table_columns
                    this.displayedColumns = _.split(item.value, ',');
                }
            });
        }

        if (changes.options) {
            if (!_.isEmpty(this.options)) {
                const option = this.options[Setting.user_table_columns];
                this.availableColumns = [];
                Object.keys(option).forEach(key => {
                    this.availableColumns.push({
                        label: option[key],
                        value: key
                    });
                });
            }
        }
    }

    ngOnInit() {
    }

    onDrop(event) {}

    // onChange(event) {
    //     this.settingsService.setSetting(id, value).subscribe(res => {
    //         setting.value = value;
    //         this.settingsChange.next(this.settings);
    //         this.toastr.success(res.message);
    //     });
    // }

}
