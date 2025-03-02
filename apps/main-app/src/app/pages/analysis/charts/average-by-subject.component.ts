import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Input,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { IExamModel } from '@softbar/api-interfaces';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'softbar-analysis-average-by-subject-chart',
  standalone: true,
  template: `
    @if(!last){
    <div #chartContainer class="chart-container">
      <ngx-charts-bar-vertical
        [view]="view"
        [results]="subjectAverages"
        [scheme]="'cool'"
        [gradient]="false"
        [xAxis]="true"
        [yAxis]="true"
        [legend]="false"
        [showDataLabel]="true"
        [showXAxisLabel]="true"
        [showYAxisLabel]="true"
      >
      </ngx-charts-bar-vertical>
    </div>
    }
  `,
  styles: [
    `
      .chart-container {
        width: 100%;
        height: 100%;
        min-width: 300px;
        min-height: 200px;
        max-width: 100%;
        max-height: 100%;
        resize: both;
        overflow: hidden;
        border: 1px solid #ccc;
      }
    `,
  ],
  imports: [NgxChartsModule],
})
export class AverageBySubjectComponent implements OnChanges, AfterViewInit {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  @Input({ required: true }) index: number; // The input that triggers the chart update
  @Input({ required: true }) last: boolean; // The input that triggers the chart update

  subjectAverages: { name: string; value: number }[] = [];
  view: [number, number] = [700, 400]; // Default chart size

  @Input({ required: true })
  set exams(values: IExamModel[]) {
    if (Array.isArray(values)) {
      this.calculateAverages(values); // Recalculate when subjects change
    }
  }

  private calculateAverages(values: IExamModel[]) {
    const subjectGrades: { [key: string]: number[] } = {};

    values.forEach((exam: IExamModel) => {
      if (!subjectGrades[exam.subject]) {
        subjectGrades[exam.subject] = [];
      }
      subjectGrades[exam.subject].push(exam.grade);
    });

    this.subjectAverages = Object.keys(subjectGrades).map((subject) => ({
      name: subject,
      value:
        subjectGrades[subject].reduce((a, b) => a + b, 0) /
        subjectGrades[subject].length,
    }));
  }

  ngAfterViewInit(): void {
    this.applyResize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['index'] &&
      changes['index'].previousValue !== changes['index'].currentValue
    ) {
      this.applyResize();
    }
  }

  private applyResize() {
    requestAnimationFrame(() => {
      if (this.chartContainer) {
        const width = this.chartContainer.nativeElement.offsetWidth;
        const height = this.chartContainer.nativeElement.offsetHeight;
        this.view = [width, height]; // Update chart size dynamically
      }
    });
  }
}
