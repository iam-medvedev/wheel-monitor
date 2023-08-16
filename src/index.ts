import { px } from './utils';

const errorPrefix = '[wheel-monitor]:';

type Axis = 'x' | 'y' | string;

interface WheelMonitorSettings {
  /** `manual` mode flag */
  manual?: boolean;
  /** `scale` mode flag */
  scale?: boolean;
  /** Scroll axis */
  axis?: Axis;
  /** Canvas height */
  height?: number;
  /** Canvas width */
  width?: number;
  /** Canvas z-index */
  zIndex?: number;
  /** Chart bar color */
  barColor?: string;
  /** Custom `className` */
  className?: string;
}

const defaults: Required<WheelMonitorSettings> = {
  manual: false,
  scale: false,
  axis: 'x',
  height: 100,
  width: 200,
  zIndex: 999999,
  barColor: '#0000cc',
  className: '',
};

export class WheelMonitor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private centerY: number;
  private barColor: string;
  private isManual: boolean;
  private isScale: boolean;
  private axis: Axis;
  private deltas: number[] = [];

  constructor(_settings: WheelMonitorSettings = {}) {
    const settings = { ...defaults, ..._settings };
    this.onWheel = this.onWheel.bind(this);
    this.isManual = settings.manual;
    this.isScale = settings.scale;
    this.barColor = settings.barColor;
    this.axis = settings.axis;

    // Create a canvas element, apply styles and settings
    this.canvas = document.createElement('canvas');
    if (settings.className) {
      this.canvas.classList.add(settings.className);
    } else {
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = px(8);
      this.canvas.style.left = px(8);
      this.canvas.style.backgroundColor = '#fff';
      this.canvas.style.border = '1px solid black';
      this.canvas.style.zIndex = String(settings.zIndex || 999999);
    }
    this.canvas.width = settings.width || 200;
    this.canvas.height = settings.height || 100;
    this.centerY = Math.floor(this.canvas.height / 2);
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
   * Scales an array of values based on a canvas height
   */
  private getScaledValues() {
    const arr = this.deltas;
    const limit = this.canvas.height;
    const maxVal = Math.max(...arr);
    const minVal = Math.min(...arr);

    if (maxVal <= limit && minVal >= -limit) {
      // No need to scale, all values are within the limit
      return arr;
    }

    const scaleFactor = Math.abs(limit / Math.max(Math.abs(maxVal), Math.abs(minVal)));
    const scaledArray = arr.map((value) => value * scaleFactor);

    return scaledArray;
  }

  /**
   * Redraws a bar representing the scroll movement
   */
  private redraw() {
    // Clears canvas before redraw
    this.clear();

    const values = this.isScale ? this.getScaledValues() : this.deltas;
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      this.ctx.fillStyle = this.barColor;
      this.ctx.fillRect(i, this.centerY, 2, -value);
    }

    if (values.length > this.canvas.width) {
      this.reset();
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
    this.deltas.push(delta);
    this.redraw();
  }

  /**
   * Clears canvas
   */
  private clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Resets canvas
   */
  private reset() {
    this.deltas = [];
  }

  /**
   * Manual trigger. Work only if `settings.manual` is set to `true`.
   */
  public trigger(delta: number) {
    if (!this.isManual) {
      throw new Error(`${errorPrefix} 'trigger()' works only when 'manual' mode enabled.`);
    }

    this.deltas.push(delta);
    this.redraw();
  }

  /**
   * Destroys the instance
   */
  public destroy() {
    this.unbindEvents();
    document.body.removeChild(this.canvas);
  }
}
