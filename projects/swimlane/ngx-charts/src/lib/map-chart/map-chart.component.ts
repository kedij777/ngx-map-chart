import { Component, ViewChild, ElementRef, Input, Renderer2, OnInit, SimpleChanges } from '@angular/core';
import { BaseChartComponent } from '../common/base-chart.component';
import * as L from 'leaflet';
import {select} from 'd3-selection';

@Component({
  selector: 'ngx-charts-map-chart',
  template: `
  <div class="ng-container">
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
   integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
   crossorigin=""></script>
  <div id="map"></div>
</div>
  `,
  styleUrls: ['./map-chart.component.scss'],
})
export class MapChartComponent extends BaseChartComponent implements OnInit {
  @Input() legend: boolean = false;
  @Input() legendTitle: string = 'Legend';
  @Input() centerMapAt: any;
  @Input() activeEntries: any[] = [];
  @Input() animations: boolean = true;
  @Input() leafletOptions;
  @Input() longitude: number;
  @Input() latitude: number;
  @Input() view: [number, number];
  @Input() elementRef: ElementRef;
  @Input() mapLanguage: string;
  
  map: L.Map;
  currentTiles = null;

  update(): void {
    this.adjustSize();

    if (this.map) {
      //trigger the map to reload
      this.map.invalidateSize();
      let latlng = L.latLng(this.latitude,this.longitude);
      this.map.setView(latlng);
    } else {
      this.initMap();
    }

    if (this.mapLanguage) {
      const newCenter = this.map.getCenter();
      this.longitude = newCenter.lng;
      this.latitude = newCenter.lat;
      let latlng = L.latLng(this.latitude,this.longitude);
      this.map.setView(latlng);
      this.changeLanguage();
    }
  }
  
  
  initMap(): void {
    let centroid: L.LatLngExpression = [this.latitude, this.longitude]; 

    this.map = L.map('map', {
      center: centroid,
      zoom: 12
    });
    this.currentTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 1,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    this.currentTiles.addTo(this.map);

  }
   adjustSize() {
    if (this.view) {
      this.width = this.view[0];
      this.height = this.view[1];
    }
    const container = select(this.chartElement.nativeElement).select('.ng-container').node() as HTMLElement;
    container.style.width = this.width + "px"; 
    container.style.height = this.height + "px";

  }

  changeLanguage() {
    // Remove the current tile layer if it exists
    if (this.currentTiles) {
      this.map.removeLayer(this.currentTiles);
    }

    // Create and add the new tile layer based on mapLanguage
    if (this.mapLanguage == "native") {
      this.currentTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 1,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });
    } else if (this.mapLanguage == "german"){
      this.currentTiles = L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 1,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });
    } else if (this.mapLanguage == "english") {
      this.currentTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
        minZoom: 1,
        maxZoom: 18,
        attribution: '&copy; <a href="https://carto.com/">carto.com</a> contributors'
      });
    }
    
    this.currentTiles.addTo(this.map);

    this.map.setView([this.latitude, this.longitude]);
  }

}