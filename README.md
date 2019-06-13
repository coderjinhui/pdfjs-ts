# pdfjs-ts
simple pdfjs in typescript

## Usage
1. copy the static file, you can download in [mozilla pdf.js](https://github.com/mozilla/pdf.js)  or just find in src/pdfjs folder
  - [**must**] copy pdf.worker.min.js in to yout project
  - copy the text_layer_builder.css to your project if you want render text in pdf

2. write code in ts file

```html
<!-- in html file -->
<div id="container"></div>
```

```typescript
// this example is in Angular
// simple single page render
import { PDFTS } from 'pdfjs-ts/dist';
....
this.pdf = new PDFTS({
  url: this.url,
  container: document.querySelector('#container'),
  workerURL: '/assets/pdfjs/pdf.worker.min.js',
});
this.pdf.initial().then(_ => {
  this.pdf.renderer.render();
});

// multiple page
this.pdf = new PDFTS({
  url: this.url,
  container: document.querySelector('#container'),
  workerURL: '/assets/pdfjs/pdf.worker.min.js',
  multiple: true
});
this.pdf.initial().then(_ => {
  this.pdf.renderer.render();
});

// enable webGL
this.pdf = new PDFTS({
  url: this.url,
  container: document.querySelector('#container'),
  workerURL: '/assets/pdfjs/pdf.worker.min.js',
  multiple: true,
  enableWebGL: true
});
this.pdf.initial().then(_ => {
  this.pdf.renderer.render();
});

// render text
this.pdf = new PDFTS({
  url: this.url,
  container: document.querySelector('#container'),
  workerURL: '/assets/pdfjs/pdf.worker.min.js',
  multiple: true,
  renderText: true,
});
this.pdf.initial().then(_ => {
  this.pdf.renderer.render();
});

```

## Feature

- search: almost done
- progress: indevelopment
- other new feture if i want to...
