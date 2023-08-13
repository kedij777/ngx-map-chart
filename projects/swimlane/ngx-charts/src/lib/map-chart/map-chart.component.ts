import {
    Component,
    Input,
    ElementRef,
    ViewChild,
    AfterViewInit,
    ChangeDetectionStrategy,
    Output,
    EventEmitter,
    ViewEncapsulation,
    ContentChild,
    TemplateRef
  } from '@angular/core';
import { BaseChartComponent } from '../common/base-chart.component';
import { LegendOptions, LegendPosition } from '../common/types/legend.model';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import {tile} from "d3-tile";

@Component({
  selector: 'ngx-charts-map-chart',
  template: `    
    <ngx-charts-chart
    [view]="[width, height]"
    [showLegend]="legend"
    [animations]="animations"
    [legendOptions]="legendOptions"
      >
    <svg:g #mapGroup>
      <defs>
        <path id="graticulePath" d=""></path>
      </defs>
      
      <g class="graticule-group">
        <use xlink:href="#graticulePath" class="graticule"></use>
        <use xlink:href="#graticulePath" class="graticule outline"></use>
      </g>
      
      <g class="countries-group">
      </g>
    </svg:g>
    </ngx-charts-chart>
    `,
    styleUrls: ['../common/base-chart.component.scss','./map-chart.component.scss']
})  

export class MapChartComponent extends BaseChartComponent{
  @ViewChild('mapGroup', { static: true }) mapGroup: ElementRef<SVGGElement>;
    @Input() legend: boolean = false;
    @Input() legendTitle: string = 'Legend';
    @Input() legendPosition: LegendPosition = LegendPosition.Right;
    @Input() activeEntries: any[] = [];
    @Input() topojson: topojson;

    @Output() activate: EventEmitter<any> = new EventEmitter();
    @Output() deactivate: EventEmitter<any> = new EventEmitter();

    legendOptions: LegendOptions;

    width = 960;
    height = 500;
    projection = d3.geoEquirectangular();
    colorRange = d3.schemeCategory10; 
    color = d3.scaleOrdinal<string>(this.colorRange);

    graticule = d3.geoGraticule();
    path = d3.geoPath().projection(this.projection);
    tile = tile()
      .extent([[0, 0], [this.width, this.height]])
      .tileSize(512)
      .clampX(false);
    


      zoomed(transform,image,svg,url) {
        const tiles = tile(transform);
  
        image = image.data(tiles, d => d).join("image")
            .attr("xlink:href", d => url(...this.tileWrap(d)))
            .attr("x", ([x]) => (x + tiles.translate[0]) * tiles.scale)
            .attr("y", ([, y]) => (y + tiles.translate[1]) * tiles.scale)
            .attr("width", tiles.scale)
            .attr("height", tiles.scale);

        return svg.node();
      }
      tileWrap([x, y, z]) {
        const j = 1 << z;
        return [x - Math.floor(x / j) * j, y - Math.floor(y / j) * j, z];
      }
    ngOnInit() {
      var svg = d3.select(this.mapGroup.nativeElement);
      svg.attr("viewBox", [0, 0, this.width,  this.height]);
      var image = svg.append("g").attr("pointer-events", "none").selectAll("image");
      var url = (x, y, z) => `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/${z}/${x}/${y}${devicePixelRatio > 1 ? "@2x" : ""}?access_token=pk.eyJ1IjoibWJvc3RvY2siLCJhIjoiY2s5ZWRlbTM4MDE0eDNocWJ2aXR2amNmeiJ9.LEyjnNDr_BrxRmI4UDyJAQ`;

      var zoom = d3.zoom()
      .scaleExtent([1 << 8, 1 << 22])
      .extent([[0, 0], [this.width, this.height]])
      .on("zoom", ({transform}) => this.zoomed(transform,image,svg,url));


      svg
      .call(zoom)
      .call(zoom.transform, d3.zoomIdentity
        .translate(this.width >> 1, this.height >> 1)
        .scale(1 << 12));
    }
  }
