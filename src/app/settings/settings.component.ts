import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface GraphSettings {
  nodeSpacing: number;
  lineStrokeWidth: number;
  circleRadius: number;
  gap: number;
  colors: string[];
  defaultY: number;
  upY: number;
  arrowMarkerWidth: number;
  startXBase: number;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  @Output() settingsChange = new EventEmitter<GraphSettings>();
  @Output() close = new EventEmitter<void>();

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

  newColor: string = '#000000';

  onSettingsChange(): void {
    this.settingsChange.emit(this.settings);
  }

  addColor(): void {
    if (this.newColor) {
      this.settings.colors.push(this.newColor);
      this.newColor = '#000000';
      this.onSettingsChange();
    }
  }

  removeColor(index: number): void {
    this.settings.colors.splice(index, 1);
    this.onSettingsChange();
  }

  onClose(): void {
    this.close.emit();
  }

  onApply(): void {
    this.onSettingsChange();
    this.close.emit();
  }
} 