# Wheel Monitor

<img width="140" src="./demo/demo.gif" />

The Wheel Monitor is a TypeScript class that creates a visual representation of scroll activity for debugging purposes..

It provides an easy way to monitor and visualize scroll events on a webpage.

## Installation

You can install the Wheel Monitor using your preferred package manager:

```bash
yarn add -D wheel-monitor
```

or

```bash
npm install --save-dev wheel-monitor
```

## Usage

To use the Wheel Monitor, you need to import the `WheelMonitor` class and create an instance:

```ts
import { WheelMonitor } from 'wheel-monitor';

// Create an instance of WheelMonitor with custom settings
const monitor = new WheelMonitor({
  axis: 'y',
  height: 100,
  width: 200,
  color: '#0000cc',
  backgroundColor: '#fff',
});

// To destroy the monitor and remove event listeners and canvas
monitor.destroy();
```

## Manual mode

Ability to programmatically trigger a scroll event. For example, if you handle the scroll yourself.

```ts
import { WheelMonitor } from 'wheel-monitor';

const monitor = new WheelMonitor({
  manual: true,
});

window.addEventListener('wheel', (e) => {
  monitor.trigger(e.deltaX);
});
```

## Options

The WheelMonitorSettings interface provides several options to customize the appearance and behavior of the monitor:

| Option            | Description                                           | Default Value |
| ----------------- | ----------------------------------------------------- | ------------- |
| `axis`            | The scroll axis. Default is `y`                       | `x` or `y`    |
| `manual`          | The `manual` mode flag                                | false         |
| `height`          | The height of the canvas in pixels.                   | `100`         |
| `width`           | The width of the canvas in pixels.                    | `200`         |
| `color`           | The color of the scroll bar (CSS color value).        | `#0000cc`     |
| `backgroundColor` | The background color of the canvas (CSS color value). | `#fff`        |

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
