import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { LazyLoadEvent, FilterInsideObject } from '../../lazy-load-event.type';
import { debounceTime } from 'rxjs/operators';
import { BaseComponent } from '../../../../core/components/base-component.directive';
import { ITableFilter } from './helpers';
import { CommonModule } from '@angular/common';
import { TableSelectInputComponent } from '../table-select-input/table-select-input.component';

class NewFormGroup<
  T,
  ChildControl extends AbstractControl = AbstractControl
> extends FormGroup {
  override controls: {
    [key in keyof T]: ChildControl;
  };
}

@Component({
  selector: 'softbar-app-table-filters',
  templateUrl: './table-filters.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./table-filters.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, TableSelectInputComponent],
})
export class TableFiltersComponent<T = any>
  extends BaseComponent
  implements OnInit
{
  public form?: NewFormGroup<T, NewFormGroup<FilterInsideObject, FormControl>>;
  @Input() public showResetFilters?: boolean | string;
  @Input() public filters?: ITableFilter<T>[];
  @Output() public filterChange: EventEmitter<
    LazyLoadEvent<T>['filters'][number]
  > = new EventEmitter<LazyLoadEvent<T>['filters'][number]>();

  public filterControl = (key: keyof T): FormGroup | null =>
    this.form?.controls?.[key] || null;

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.form = this.fb.group(
      this.filters.reduce(
        (p, c) => ({
          ...p,
          [c.key]: this.fb.group({
            matchMode: this.fb.control(null),
            value: (() => {
              const control = this.fb.control(null);
              switch (c?.type) {
                case 'number': {
                  control.valueChanges.subscribe((value) => {
                    if (value === '') {
                      control.setValue(null, { emitEvent: false });
                    } else {
                      control.setValue(Number(value), {
                        emitEvent: false,
                      });
                    }
                  });
                  break;
                }
                default:
                  break;
              }
              return control;
            })(),
          }),
        }),
        {}
      )
    ) as TableFiltersComponent<T>['form'];
    this.form?.valueChanges
      ?.pipe<
        LazyLoadEvent<T>['filters'][number],
        LazyLoadEvent<T>['filters'][number]
      >(debounceTime(100), this.takeUntilDestroy())
      .subscribe((x) => this.filterChange.next(x));
  }
}
