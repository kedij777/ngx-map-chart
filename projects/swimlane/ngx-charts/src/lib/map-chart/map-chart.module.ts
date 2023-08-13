
import { NgModule } from '@angular/core';
import{ MapChartComponent } from './map-chart.component';
import { ChartCommonModule } from '../common/chart-common.module';

@NgModule({
    imports: [ChartCommonModule],
    declarations: [MapChartComponent],
    exports: [MapChartComponent]
  })

  export class  MapChartModule {}