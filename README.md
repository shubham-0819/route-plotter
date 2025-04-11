# RoutePlotter

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Features

RoutePlotter is a web application that allows users to create and visualize routes between different locations. Here are its main features:

- **Route Creation**: Add routes by specifying source and destination cities
- **Visual Representation**: Routes are displayed as an interactive SVG graph
- **Customization**: Adjust graph settings including:
  - Node spacing
  - Line stroke width
  - Circle radius
  - Colors
  - And more
- **Route Management**:
  - Edit existing routes
  - Clear all routes
  - Download the route visualization as an SVG image
- **Validation**:
  - City names must be at least 3 letters long
  - Source and destination cannot be the same
  - Automatic formatting of city names

## Usage

1. Enter a source city in the first input field
2. Enter a destination city in the second input field
3. Click "Add Route" to create a new route
4. Use the "Settings" button to customize the graph appearance
5. Use the "Edit" button to modify existing routes
6. Click "Download SVG" to save the visualization as an image

The application will automatically generate a visual representation of your routes, showing connections between cities with appropriate arrows and spacing.

