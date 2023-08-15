import { px } from './utils';

interface ScrollMonitorSettings {
  /** The height of the canvas. Default is `100px`. */
  height?: number;
  /** The width of the canvas. Default is `200px`. */
  width?: number;
  /** The color of the scroll bar. Default is `#0000cc`. */
  color?: string;
  /** The background color of the canvas. Default is `#fff`. */
  backgroundColor?: string;
}

export class ScrollMonitor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private centerY: number = 0;
  private barColor = '#0000cc';
  private lastX: number = 0;

  constructor(settings: ScrollMonitorSettings = {}) {
    this.onWheel = this.onWheel.bind(this);

    // Create a canvas element, apply styles and settings
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = px(8);
    this.canvas.style.left = px(8);
    this.canvas.style.backgroundColor = settings.backgroundColor || '#fff';
    this.canvas.style.border = '1px solid black';
    this.canvas.width = settings.width || 200;
    this.canvas.height = settings.height || 100;
    this.centerY = Math.floor(this.canvas.height / 2);
    this.canvas.classList.add('scroll-monitor');
    document.body.appendChild(this.canvas);

    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('[scroll-monitor]: Cannot get canvas context');
    }
    this.ctx = ctx;

    // Bind event listeners during construction
    this.bindEvents();
  }

  private bindEvents() {
    window.addEventListener('wheel', this.onWheel);
  }

  private unbindEvents() {
    window.removeEventListener('wheel', this.onWheel);
  }

  private clear() {
    this.lastX = 0;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws a bar representing the scroll movement
   */
  private onWheel(e: WheelEvent) {
    const delta = e.deltaY;

    // Draw the bar on the canvas
    this.ctx.fillStyle = this.barColor;
    this.ctx.fillRect(this.lastX, this.centerY, 2, -delta);

    // Increment lastX and clear the canvas if necessary
    if (this.lastX++ > this.canvas.width) {
      this.clear();
    }
  }

  public destroy() {
    this.unbindEvents();
    document.body.removeChild(this.canvas);
  }
}
