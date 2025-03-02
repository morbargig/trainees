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
  selector: 'softbar-analysis-average-over-time-chart',
  standalone: true,
  template: `
    @if(!last){
    <div #chartContainer class="chart-container">
      <ngx-charts-line-chart
        [view]="view"
        [results]="averageOverTime"
        [scheme]="'cool'"
        [xAxis]="true"
        [yAxis]="true"
        [legend]="true"
        [showXAxisLabel]="true"
        [showYAxisLabel]="true"
        xAxisLabel="Date"
        yAxisLabel="Average Grade"
        [autoScale]="true"
      >
      </ngx-charts-line-chart>
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
export class AverageOverTimeComponent implements OnChanges, AfterViewInit {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  @Input({ required: true }) index: number;
  @Input({ required: true }) last: boolean;
  @Input({ required: true }) students: IStudentModel[];

  view: [number, number] = [700, 400]; // Default chart size
  averageOverTime: any[] = [];

  @Input({ required: true })
  set exams(values: IExamModel[]) {
    if (Array.isArray(values)) {
      requestAnimationFrame(() => {
        this.calculateAverageOverTime(values);
      });
    }
  }

  private calculateAverageOverTime(values: IExamModel[]) {
    const studentExams: { [key: string]: IExamModel[] } = {};

    // Group exams by student and sort them by date
    values.forEach((exam: IExamModel) => {
      if (!studentExams[exam.studentId]) {
        studentExams[exam.studentId] = [];
      }
      studentExams[exam.studentId].push(exam);
    });

    Object.keys(studentExams).forEach((studentId) => {
      studentExams[studentId].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    });

    // Prepare data for ngx-charts line chart
    this.averageOverTime = Object.entries(studentExams).map(
      ([studentId, exams]) => {
        const student = this.students?.find(
          (s) => s.id.toString() === studentId
        );
        let cumulativeSum = 0;

        return {
          name: student.name,
          series: exams.map((exam, index) => {
            cumulativeSum += exam.grade;
            return {
              name: exam.date, // X-axis (time)
              value: cumulativeSum / (index + 1), // Y-axis (cumulative average)
            };
          }),
        };
      }
    );
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
