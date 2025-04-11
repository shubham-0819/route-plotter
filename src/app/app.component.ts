import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoutePlotterComponent } from './route-plotter/route-plotter.component';
@Component({
  selector: 'app-root',
  imports: [ RoutePlotterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'route-plotter';
}
