import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Trip } from '../route-plotter/route-plotter.component';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {
  @Input() trips: Trip[] = [];
  @Output() tripsChange = new EventEmitter<Trip[]>();
  @Output() applyChanges = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  editedTrips: Trip[] = [];

  ngOnInit(): void {
    this.editedTrips = [...this.trips];
  }

  deleteTrip(index: number): void {
    this.editedTrips.splice(index, 1);
  }

  onApply(): void {
    this.tripsChange.emit([...this.editedTrips]);
    this.applyChanges.emit();
  }

  onClose(): void {
    this.close.emit();
  }
} 