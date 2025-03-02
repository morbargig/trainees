import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Input,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { IExamModel, IStudentModel } from '@softbar/api-interfaces';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'softbar-analysis-average-by-student-chart',
  standalone: true,
  template: `
    @if(!last){
    <div #chartContainer class="chart-container">
      <ngx-charts-bar-vertical
        [view]="view"
        [results]="studentsAverages"
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
export class AverageByStudentComponent implements OnChanges, AfterViewInit {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  @Input({ required: true }) index: number; // The input that triggers the chart update
  @Input({ required: true }) last: boolean; // The input that triggers the chart update

  studentsAverages: { name: string; value: number }[] = [];
  view: [number, number] = [700, 400]; // Default chart size
  @Input({ required: true }) students: IStudentModel[];
  @Input({ required: true })
  set exams(values: IExamModel[]) {
    if (Array.isArray(values)) {
      requestAnimationFrame(() => {
        this.calculateAverages(values); // Recalculate when subjects change
      });
    }
  }

  private calculateAverages(values: IExamModel[]) {
    const subjectGrades: { [key: string]: number[] } = {};

    values.forEach((exam: IExamModel) => {
      if (!subjectGrades[exam.studentId]) {
        subjectGrades[exam.studentId] = [];
      }
      subjectGrades[exam.studentId].push(exam.grade);
    });

    this.studentsAverages = Object.keys(subjectGrades).map((studentId) => {
      return {
        // change to name
        id: studentId,
        name: this.students?.find((i) => i?.id?.toString() === studentId)?.name,
        value:
          subjectGrades[studentId].reduce((a, b) => a + b, 0) /
          subjectGrades[studentId].length,
      };
    });
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
