import { expect, it, vi, beforeEach } from 'vitest';
import { WheelMonitor } from '../';

const fillRect = vi.fn();
const fillStyle = vi.fn();

beforeEach(() => {
  fillRect.mockReset();
  fillStyle.mockReset();

  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: vi.fn(() => {
      return {
        clearRect: vi.fn(),
        fillRect,
        fillStyle: {
          set: fillStyle,
          get: vi.fn(),
        },
      };
    }),
  });
  document.body.innerHTML = '';
});

it('works with native `wheel` bindings', () => {
  const instance = new WheelMonitor({
    zIndex: 100,
  });

  expect(instance).toBeDefined();

  const canvas = document.querySelector('canvas');
  expect(canvas).toBeDefined();
  expect(canvas?.style.zIndex).toEqual('100');

  window.dispatchEvent(new WheelEvent('wheel', { deltaY: 6 }));
  window.dispatchEvent(new WheelEvent('wheel', { deltaY: 8 }));
  window.dispatchEvent(new WheelEvent('wheel', { deltaY: 160 }));
  window.dispatchEvent(new WheelEvent('wheel', { deltaY: 100 }));
  window.dispatchEvent(new WheelEvent('wheel', { deltaY: -20 }));

  expect(instance['deltas']).toEqual([6, 8, 160, 100, -20]);

  expect(() => instance.trigger(1)).toThrowError();

  const resultCalls = fillRect.mock.calls.slice(-5);
  expect(resultCalls).toEqual([
    [0, 50, 2, -6],
    [1, 50, 2, -8],
    [2, 50, 2, -160],
    [3, 50, 2, -100],
    [4, 50, 2, 20],
  ]);
});

it('works with `manual` mode', () => {
  const instance = new WheelMonitor({ manual: true });

  expect(instance).toBeDefined();

  const canvas = document.querySelector('canvas');
  expect(canvas).toBeDefined();
  expect(canvas?.style.position).toEqual('fixed');

  window.dispatchEvent(new WheelEvent('wheel', { deltaY: 6 }));
  expect(instance['deltas']).toEqual([]);

  expect(() => {
    instance.trigger(10);
    instance.trigger(8);
    instance.trigger(160);
    instance.trigger(100);
    instance.trigger(200);
  }).not.toThrowError();
});

it('works with x-axis', () => {
  const instance = new WheelMonitor({
    axis: 'x',
  });

  expect(instance).toBeDefined();

  const canvas = document.querySelector('canvas');
  expect(canvas).toBeDefined();

  window.dispatchEvent(new WheelEvent('wheel', { deltaY: 6 }));
  window.dispatchEvent(new WheelEvent('wheel', { deltaY: 8 }));
  window.dispatchEvent(new WheelEvent('wheel', { deltaY: 160 }));
  window.dispatchEvent(new WheelEvent('wheel', { deltaY: 100 }));
  window.dispatchEvent(new WheelEvent('wheel', { deltaY: 20, deltaX: 30 }));

  expect(instance['deltas']).toEqual([0, 0, 0, 0, 30]);
});

it('works with `scale` mode', () => {
  const instance = new WheelMonitor({
    scale: true,
  });

  expect(instance).toBeDefined();

  const canvas = document.querySelector('canvas');
  expect(canvas).toBeDefined();

  window.dispatchEvent(new WheelEvent('wheel', { deltaY: 6 }));
  window.dispatchEvent(new WheelEvent('wheel', { deltaY: 8 }));
  window.dispatchEvent(new WheelEvent('wheel', { deltaY: 160 }));
  window.dispatchEvent(new WheelEvent('wheel', { deltaY: 100 }));
  window.dispatchEvent(new WheelEvent('wheel', { deltaY: 20 }));

  expect(instance['deltas']).toEqual([6, 8, 160, 100, 20]);
  const resultCalls = fillRect.mock.calls.slice(-5);
  expect(resultCalls).toEqual([
    [0, 50, 2, -3.75],
    [1, 50, 2, -5],
    [2, 50, 2, -100],
    [3, 50, 2, -62.5],
    [4, 50, 2, -12.5],
  ]);
});

it('overriding styles', () => {
  const className = 'custom-class';
  const barColor = 'red';
  const instance = new WheelMonitor({
    className,
    barColor,
  });

  expect(instance).toBeDefined();

  const canvas = document.querySelector('canvas');
  expect(canvas).toBeDefined();

  expect(canvas?.className).toEqual(className);
  expect(canvas?.style.position).toEqual('');

  expect(instance['barColor']).toEqual(barColor);
});

it('overriding height', () => {
  const instance = new WheelMonitor({
    scale: true,
    height: 20,
  });

  expect(instance).toBeDefined();

  const canvas = document.querySelector('canvas');
  expect(canvas).toBeDefined();

  window.dispatchEvent(new WheelEvent('wheel', { deltaY: 6 }));
  window.dispatchEvent(new WheelEvent('wheel', { deltaY: 8 }));
  window.dispatchEvent(new WheelEvent('wheel', { deltaY: 160 }));
  window.dispatchEvent(new WheelEvent('wheel', { deltaY: 100 }));
  window.dispatchEvent(new WheelEvent('wheel', { deltaY: 20 }));

  expect(instance['deltas']).toEqual([6, 8, 160, 100, 20]);
  const resultCalls = fillRect.mock.calls.slice(-5);
  expect(resultCalls).toEqual([
    [0, 10, 2, -0.75],
    [1, 10, 2, -1],
    [2, 10, 2, -20],
    [3, 10, 2, -12.5],
    [4, 10, 2, -2.5],
  ]);
});
