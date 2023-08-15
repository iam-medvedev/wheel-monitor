import { px } from './utils';

const errorPrefix = '[scroll-monitor]:';

type Axis = 'x' | 'y' | string;

interface ScrollMonitorSettings {
  /** The height of the canvas. Default is `100px`. */
  height?: number;
  /** The width of the canvas. Default is `200px`. */
  width?: number;
  /** The color of the scroll bar. Default is `#0000cc`. */
  color?: string;
  /** The background color of the canvas. Default is `#fff`. */
  backgroundColor?: string;
  /** The `manual` mode flag. */
  manual?: boolean;
  /** The scroll axis. Default is `y` */
  axis?: Axis;
}

export class ScrollMonitor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private centerY: number = 0;
  private barColor = '#0000cc';
  private lastX: number = 0;
  private isManual = false;
  private axis: Axis = 'y';

  constructor(settings: ScrollMonitorSettings = {}) {
    this.onWheel = this.onWheel.bind(this);
    this.isManual = typeof settings.manual === 'boolean' ? settings.manual : false;
    this.axis = settings.axis || 'y';

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
      throw new Error(`${errorPrefix} Cannot get canvas context`);
    }
    this.ctx = ctx;

    if (!this.isManual) {
      // Bind event listeners
      this.bindEvents();
    }
  }

  /**
   * Binds internal events
   */
  private bindEvents() {
    window.addEventListener('wheel', this.onWheel);
  }

  /**
   * Unbinds internal events
   */
  private unbindEvents() {
    window.removeEventListener('wheel', this.onWheel);
  }

  /**
   * Draws a bar representing the scroll movement
   */
  private draw(delta: number) {
    // Draw the bar on the canvas
    this.ctx.fillStyle = this.barColor;
    this.ctx.fillRect(this.lastX, this.centerY, 2, -delta);

    // Increment lastX and clear the canvas if necessary
    if (this.lastX++ > this.canvas.width) {
      this.clear();
    }
  }

  /**
   * Internal `wheel` listener
   */
  private onWheel(e: WheelEvent) {
    if (this.isManual) {
      return;
    }

    const delta = this.axis === 'y' ? e.deltaY : e.deltaX;
    this.draw(delta);
  }

  /**
   * Clears canvas
   */
  private clear() {
    this.lastX = 0;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Manual trigger. Work only if `settings.manual` is set to `true`.
   */
  public trigger(delta: number) {
    if (!this.isManual) {
      throw new Error(`${errorPrefix} 'trigger()' works only when 'manual' mode enabled.`);
    }
    this.draw(delta);
  }

  /**
   * Destroys the instance
   */
  public destroy() {
    this.unbindEvents();
    document.body.removeChild(this.canvas);
  }
}
