import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsComponent, GraphSettings } from '../settings/settings.component';
import { EditComponent } from '../edit/edit.component';
import { InfoModalComponent } from '../info-modal/info-modal.component';

export interface Trip {
  source: string;
  destination: string;
}

interface Connection {
  fromIndex: number;
  toIndex: number;
  connectionType: string;
}

@Component({
  selector: 'app-route-plotter',
  standalone: true,
  imports: [CommonModule, FormsModule, SettingsComponent, EditComponent, InfoModalComponent],
  templateUrl: './route-plotter.component.html',
  styleUrls: ['./route-plotter.component.css']
})
export class RoutePlotterComponent implements OnInit {
  trips: Trip[] = [];
  showInfoModal = false;
  showTips = false;
  newTrip: Trip = { source: '', destination: '' };
  
  // Configuration values
  settings: GraphSettings = {
    nodeSpacing: 180,
    lineStrokeWidth: 2,
    circleRadius: 5,
    gap: 10,
    colors: ['#FF5733', '#33FF57'],
    defaultY: 200,
    upY: 120,
    arrowMarkerWidth: 10,
    startXBase: 100
  };

  showSettings = false;
  showEdit = false;

  constructor() { }

  ngOnInit(): void {
    this.updateSVG();
  }

  toggleInfoModal(): void {
    this.showInfoModal = !this.showInfoModal;
  }

  toggleSettings(): void {
    this.showSettings = !this.showSettings;
    if (this.showSettings) {
      this.showEdit = false;
    }
  }

  toggleEdit(): void {
    this.showEdit = !this.showEdit;
    if (this.showEdit) {
      this.showSettings = false;
    }
  }

  toggleTips(): void {
    this.showTips = !this.showTips;
  }

  addTrip(): void {
    const source = this.newTrip.source.trim();
    const destination = this.newTrip.destination.trim();

    if (!source || !destination) return;
    
    if (source.length < 3 || destination.length < 3) {
      alert('City names must be at least 3 letters long');
      return;
    }

    if (source.toLowerCase() === destination.toLowerCase()) {
      alert('Source and destination cities cannot be the same');
      return;
    }

    this.trips.push({
      source: source.toLowerCase(),
      destination: destination.toLowerCase()
    });
    
    this.newTrip = { source: '', destination: '' };
    this.updateSVG();
  }

  clearTrips(): void {
    this.trips = [];
    this.updateSVG();
  }

  downloadSVG(): void {
    const svgElement = document.getElementById('route-svg')?.querySelector('svg');
    if (!svgElement) return;

    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const width = svgElement.getAttribute('width');
    const height = svgElement.getAttribute('height');
    if (!width || !height) return;

    canvas.width = parseInt(width);
    canvas.height = parseInt(height);

    // Create an image from the SVG
    const img = new Image();
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      // Convert canvas to PNG
      const pngData = canvas.toDataURL('image/png');

      // Create download link
      const link = document.createElement('a');
      link.href = pngData;
      link.download = `route-graph-${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    img.src = url;
  }

  onSettingsChange(newSettings: GraphSettings): void {
    this.settings = newSettings;
    this.updateSVG();
  }

  onTripsChange(newTrips: Trip[]): void {
    this.trips = newTrips;
  }

  onApplyChanges(): void {
    this.updateSVG();
  }

  private computeConnections(trips: Trip[]): Connection[] {
    let connections: Connection[] = [];
    for (let i = 0; i < trips.length - 1; i++) {
      const current = trips[i];
      const next = trips[i + 1];
      let connectionType = "";
      
      if (current.source === next.source && current.destination === next.destination) {
        connectionType = "simple line (100px up)";
      } else if (current.destination === next.source) {
        connectionType = "simple line";
      } else {
        connectionType = "line with arrow";
      }
      
      connections.push({
        fromIndex: i,
        toIndex: i + 1,
        connectionType: connectionType
      });
    }
    return connections;
  }

  private computeNodePositions(trips: Trip[], connections: Connection[]): number[] {
    let nodeY = Array(trips.length).fill(this.settings.defaultY);
    connections.forEach(conn => {
      if (conn.connectionType.includes("100px up")) {
        nodeY[conn.fromIndex] = this.settings.upY;
        nodeY[conn.toIndex] = this.settings.upY;
      }
    });
    return nodeY;
  }

  private updateSVG(): void {
    const svgContainer = document.getElementById('route-svg');
    if (!svgContainer) return;
    if(this.trips.length == 0) return;

    // Clear existing SVG
    svgContainer.innerHTML = '';

    const connections = this.computeConnections(this.trips);
    const nodeY = this.computeNodePositions(this.trips, connections);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", (this.settings.nodeSpacing * this.trips.length).toString());
    svg.setAttribute("height", "400");
    svg.style.border = "1px solid #ccc";

    // Add arrow marker definition
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", "arrow");
    marker.setAttribute("markerWidth", this.settings.arrowMarkerWidth.toString());
    marker.setAttribute("markerHeight", "10");
    marker.setAttribute("refX", "0");
    marker.setAttribute("refY", "3");
    marker.setAttribute("orient", "auto");
    
    const markerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    markerPath.setAttribute("d", "M0,0 L0,6 L9,3 z");
    markerPath.setAttribute("fill", "#000");
    marker.appendChild(markerPath);
    defs.appendChild(marker);
    svg.appendChild(defs);

    // Draw nodes
    this.trips.forEach((trip, index) => {
      const x = this.settings.startXBase + index * this.settings.nodeSpacing;
      const y = nodeY[index];

      // Draw circle
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", x.toString());
      circle.setAttribute("cy", y.toString());
      circle.setAttribute("r", this.settings.circleRadius.toString());
      circle.setAttribute("stroke", this.settings.colors[index % this.settings.colors.length]);
      circle.setAttribute("stroke-width", "3");
      circle.setAttribute("fill", "#fff");
      svg.appendChild(circle);

      // Add text
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", x.toString());
      text.setAttribute("y", (y + 40).toString());
      text.setAttribute("font-size", "12");
      text.setAttribute("text-anchor", "middle");
      text.textContent = `${trip.source.slice(0, 3).toUpperCase()} - ${trip.destination.slice(0, 3).toUpperCase()}`;
      svg.appendChild(text);
    });

    // Draw connections
    connections.forEach(conn => {
      const fromX = this.settings.startXBase + conn.fromIndex * this.settings.nodeSpacing;
      const toX = this.settings.startXBase + conn.toIndex * this.settings.nodeSpacing;
      const fromY = nodeY[conn.fromIndex];
      const toY = nodeY[conn.toIndex];

      const startX = fromX + this.settings.circleRadius + this.settings.gap;
      const rawEndX = toX - this.settings.circleRadius - this.settings.gap;
      const endX = conn.connectionType === "line with arrow" ? rawEndX - this.settings.arrowMarkerWidth : rawEndX;

      if (fromY !== toY) {
        const cp1X = startX + (endX - startX) / 3;
        const cp1Y = fromY;
        const cp2X = startX + 2 * (endX - startX) / 3;
        const cp2Y = toY;

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", `M ${startX} ${fromY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${toY}`);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "#153bd1");
        path.setAttribute("stroke-width", this.settings.lineStrokeWidth.toString());

        if (conn.connectionType === "line with arrow") {
          path.setAttribute("marker-end", "url(#arrow)");
        }
        svg.appendChild(path);
      } else {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", startX.toString());
        line.setAttribute("y1", fromY.toString());
        line.setAttribute("x2", endX.toString());
        line.setAttribute("y2", toY.toString());
        line.setAttribute("stroke", "#153bd1");
        line.setAttribute("stroke-width", this.settings.lineStrokeWidth.toString());
        
        if (conn.connectionType === "line with arrow") {
          line.setAttribute("marker-end", "url(#arrow)");
        }
        svg.appendChild(line);
      }
    });

    svgContainer.appendChild(svg);
  }
} 
  