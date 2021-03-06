import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    forwardRef,
    Injector,
    Input,
    NgModule,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import {ComboSelectValue, JigsawComboSelectModule} from "../combo-select/index";
import {TimeGr, TimeService, TimeWeekStart} from "../../common/service/time.service";
import {ArrayCollection} from "../../common/core/data/array-collection";
import {Time, TimeWeekDay, WeekTime} from "../../common/service/time.types";
import {GrItem, MarkDate} from "./date-picker";
import {TimeStep} from "./time-picker";
import {DropDownTrigger} from "../../common/directive/float/float";
import {AbstractJigsawComponent} from "../../common/common";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {JigsawRangeDateTimePickerModule} from "./range-date-time-picker";
import {Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {RequireMarkForCheck} from "../../common/decorator/mark-for-check";

export type RangeDate = { beginDate: WeekTime, endDate: WeekTime }

@Component({
    selector: 'jigsaw-range-date-time-select, j-range-date-time-select',
    template: `
        <jigsaw-combo-select [(value)]="_$dateComboValue" [placeholder]="placeholder" [disabled]="disabled" [valid]="valid"
                             [openTrigger]="openTrigger" [closeTrigger]="closeTrigger" [width]="width ? width : 200">
            <ng-template>
                <jigsaw-range-date-time-picker [(beginDate)]="_$beginDate" [(endDate)]="_$endDate" [gr]="gr" [limitStart]="limitStart"
                                               [limitEnd]="limitEnd" [grItems]="grItems" [markDates]="markDates" [step]="step"
                                               [weekStart]="weekStart"
                                               (change)="_$dateItemChange.emit()" (grChange)="_$grChange($event)">
                </jigsaw-range-date-time-picker>
            </ng-template>
        </jigsaw-combo-select>
    `,
    host: {
        '[class.jigsaw-range-date-time-select]': 'true',
        '[style.min-width]': 'width'
    },
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => JigsawRangeDateTimeSelect), multi: true},
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class JigsawRangeDateTimeSelect extends AbstractJigsawComponent implements ControlValueAccessor, OnInit, OnDestroy {
    constructor(private _cdr: ChangeDetectorRef,
                // @RequireMarkForCheck 需要用到，勿删
                private _injector: Injector) {
        super();
        this._removeDateItemChangeSubscriber = this._$dateItemChange.pipe(debounceTime(100)).subscribe(() => {
            let value = {beginDate: this._$beginDate, endDate: this._$endDate};
            this._$setComboValue(value);
            this.writeValue(value)
        });
        this._removeMulInputsChangeSubscriber = this._multipleInputsChange.pipe(debounceTime(100)).subscribe(() => {
            this._changeRangeDateByGr();
        })
    }

    @Input()
    @RequireMarkForCheck()
    public valid: boolean = true;

    private _gr: TimeGr = TimeGr.date;

    /**
     * @NoMarkForCheckRequired
     */
    @Input()
    public get gr(): TimeGr | string {
        return this._gr;
    }

    public set gr(value: TimeGr | string) {
        if (typeof value === 'string') {
            value = TimeGr[value];
        }
        if (value == this._gr) return;
        this._gr = <TimeGr>value;
        if (this.initialized) {
            this._multipleInputsChange.emit();
        }
    }

    @Output()
    public grChange = new EventEmitter<TimeGr>();

    /**
     * @internal
     */
    public _$beginDate: WeekTime;

    /**
     * @internal
     */
    public _$endDate: WeekTime;

    private _date: RangeDate;

    /**
     * @NoMarkForCheckRequired
     */
    @Input()
    public get date(): RangeDate {
        return this._date;
    }

    public set date(date: RangeDate) {
        if (!this._isDateChanged(date, this.date)) return;

        this._date = date;
        if (this.initialized) {
            this._multipleInputsChange.emit();
        }
    }

    @Output()
    public dateChange = new EventEmitter<RangeDate>();

    /**
     * @NoMarkForCheckRequired
     */
    @Input()
    public limitStart: Time;

    /**
     * @NoMarkForCheckRequired
     */
    @Input()
    public limitEnd: Time;

    /**
     * @NoMarkForCheckRequired
     */
    @Input()
    public grItems: GrItem[];

    /**
     * @NoMarkForCheckRequired
     */
    @Input()
    public markDates: MarkDate[];

    /**
     * @NoMarkForCheckRequired
     */
    @Input()
    public step: TimeStep;

    /**
     * @NoMarkForCheckRequired
     */
    @Input()
    public weekStart: string | TimeWeekStart;


    @Input()
    @RequireMarkForCheck()
    public placeholder: string = '';


    @Input()
    @RequireMarkForCheck()
    public disabled: boolean;

    @Input()
    @RequireMarkForCheck()
    public openTrigger: 'mouseenter' | 'click' | 'none' | DropDownTrigger = DropDownTrigger.mouseenter;

    @Input()
    @RequireMarkForCheck()
    public closeTrigger: 'mouseleave' | 'click' | 'none' | DropDownTrigger = DropDownTrigger.mouseleave;

    /**
     * @internal
     */
    public _$grChange($event) {
        this._gr = $event;
        this.grChange.emit($event)
    }

    /**
     * @internal
     */
    public _$dateItemChange = new EventEmitter();
    private _removeDateItemChangeSubscriber: Subscription;
    private _multipleInputsChange = new EventEmitter();
    private _removeMulInputsChangeSubscriber: Subscription;

    /**
     * @internal
     */
    public _$dateComboValue: ArrayCollection<ComboSelectValue>;

    /**
     * @internal
     */
    public _$setComboValue(date: RangeDate) {
        if (!date) return;
        let [beginDate, endDate] = [this._getDateStr(<string | TimeWeekDay>date.beginDate), this._getDateStr(<string | TimeWeekDay>date.endDate)];
        if (!beginDate || !endDate) return;
        this._$dateComboValue = new ArrayCollection([{
            label: `${beginDate} - ${endDate}`,
            closable: false
        }]);
        this._cdr.markForCheck();
    }

    private _getDateStr(date: string | TimeWeekDay) {
        if (!((typeof date == 'string' && !date.includes('now')) ||
            (date && date.hasOwnProperty('year') && date.hasOwnProperty('week')))) return null;
        return typeof date == 'string' ? date : `${date.year}-${date.week}`;
    }

    public writeValue(date: RangeDate): void {
        this._date = date;
        this.dateChange.emit(date);
        this._propagateChange();
    }

    private _changeRangeDateByGr() {
        if (!this._isRangeDate(this.date)) return;
        this._$beginDate = TimeService.getDateByGr(this.date.beginDate, this._gr);
        this._$endDate = TimeService.getDateByGr(this.date.endDate, this._gr);
        let convertDate = {
            beginDate: this._$beginDate,
            endDate: this._$endDate
        };
        this._$setComboValue(convertDate);
        this.writeValue(convertDate);
        this._cdr.markForCheck();
    }

    private _isDateChanged(date1: RangeDate, date2: RangeDate): boolean {
        return !date1 || !date2 || date1.beginDate != date2.beginDate || date1.endDate != date2.endDate;
    }

    private _isRangeDate(date: any) {
        return date && date.beginDate && date.endDate;
    }

    ngOnInit() {
        super.ngOnInit();
        this._changeRangeDateByGr();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        if (this._removeDateItemChangeSubscriber) {
            this._removeDateItemChangeSubscriber.unsubscribe();
            this._removeDateItemChangeSubscriber = null
        }
        if(this._removeMulInputsChangeSubscriber) {
            this._removeMulInputsChangeSubscriber.unsubscribe();
            this._removeMulInputsChangeSubscriber = null;
        }
    }

    private _propagateChange: any = () => {
    };

    public registerOnChange(fn: any): void {
        this._propagateChange = fn;
    }

    public registerOnTouched(fn: any): void {
    }

}

@NgModule({
    imports: [JigsawRangeDateTimePickerModule, JigsawComboSelectModule],
    declarations: [JigsawRangeDateTimeSelect],
    exports: [JigsawRangeDateTimeSelect]
})
export class JigsawRangeDateTimeSelectModule {

}
