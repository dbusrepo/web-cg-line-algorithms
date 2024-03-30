import type { WasmEngineModule } from './wasmEngine/wasmLoader';
import { WasmRun } from './wasmEngine/wasmRun';
import { sleep } from './utils';
import * as lineAlgs from './gfx/lines';

type LineDrawingParams = {
  wasmRun: WasmRun;
};

class LineDrawing {
  private params: LineDrawingParams;

  private wasmRun: WasmRun;

  private sleepArr: Int32Array;

  public init(params: LineDrawingParams) {
    this.wasmRun = params.wasmRun;
    this.sleepArr = new Int32Array(
      new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT),
    );
  }

  public draw() {
    // this._wasmRun.wasmModules.engine.run();
    const { FrameWidth: frameWidth, FrameHeight: frameHeight } = this.wasmRun;
    const { syncArr, sleepArr, rgbaSurface0 } = this.wasmRun.WasmViews;
    lineAlgs.initFrameParams(rgbaSurface0, frameWidth, frameHeight);
    lineAlgs.fillBackgrnd(0xff_00_00_00);
    // const wIdx = 0;
    // sleep(sleepArr, wIdx, 16);
    // console.log('Draw line: ');
    // drawHLine(10, 80, 20, 0xff_00_00_ff); // ABGR
    // drawHLine(80, 20, 20, 0xff_00_00_ff);
    // drawYLine(20, 10, 80, 0xff_00_00_ff);
    // drawLine(10, 10, 50, 50, 0xff_00_00_ff);
    // drawLine(50, 50, 10, 10, 0xff_00_00_ff);
    // drawLine(10, 30, 80, 15, 0xff_00_00_ff);
    // drawLine(10, 15, 80, 30, 0xff_00_00_ff);
    // drawLine(15, 10, 30, 80, 0xff_ff_00_ff);
    // drawLine(30, 10, 15, 80, 0xff_00_00_ff);

    // drawLineBase(10, 25, 140, 10, 0xff_ff_ff_ff);
    // drawLine(10, 25, 140, 10, 0xff_00_00_ff);

    // drawLineBase(10, 25, 140, 10, 0xff_ff_ff_ff);
    // drawLineBresFloat(10, 25, 140, 10, 0xff_00_00_ff);
    // drawLineBresFloat(10, 25, 140, 10, 0xff_00_ff_ff);
    // drawLineBresInt(10, 25, 140, 10, 0xff_00_ff_ff);
    // drawLineBresInt(10, 25, 140, 20, 0xff_00_ff_ff);
    // drawLineDDAFixed(10, 25, 140, 20, 0xff_00_00_ff);

    // drawLineDDA(10, 25, 150, 1, 0xff_00_ff_ff);
    // drawLineBresInt(10, 25, 150, 1, 0xff_00_00_ff);
    // drawLineBresInt(10, 25, 150, 1, 0xff_00_00_ff);
    // drawLineDDAFixed(10, 25, 150, 1, 0xff_00_00_ff);

    // drawLineDDA(10, 25, 23, 20, 0xff_00_ff_ff);
    // drawLineDDAFixed(10, 25, 23, 20, 0xff_00_00_ff);

    // drawLineDDA(20, 10, 30, 15, 0xff_00_ff_ff);
    // drawLineDDAFixed(20, 10, 30, 15, 0xff_00_00_ff);

    // diff btw dda and bres! -> req fix with 0.0001 in bres err init/test
    // drawLineBresFloat(10, 15, 80, 30, 0xff_ff_ff_ff);
    // drawLineDDA(10, 15, 80, 30, 0xff_00_00_ff);
    // drawLineBresFloat(15, 10, 30, 80, 0xff_ff_ff_ff);
    // drawLineDDA(15, 10, 30, 80, 0xff_00_00_ff);

    // drawLineBresFloat(5, 55, 50, 0, 0xff_ff_ff_ff);
    // drawLineDDA(5, 55, 50, 0, 0xff_00_00_ff);

    // drawLineBresFloat(140, 10, 10, 25, 0xff_00_00_ff);
    // drawLineDDA(140, 10, 10, 25, 0xff_00_00_ff);
    // drawLineBresInt(140, 10, 10, 25, 0xff_00_00_ff);

    // 2 points:
    // drawLineBresFloat(5, 55, 5, 55, 0xff_00_00_ff);
    // drawLineDDA(50, 0, 50, 0, 0xff_00_00_ff);

    // drawLineBresInt(10, 15, 80, 30, 0xff_ff_ff_ff);
    // drawLineBresFloat(10, 15, 80, 30, 0xff_00_ff_ff);
    // drawLineDDAFixed(10, 15, 80, 30, 0xff_00_00_ff);
    // drawLineDDA(10, 15, 80, 30, 0xff_00_00_ff);
    // drawLineBresFloat(15, 10, 30, 80, 0xff_ff_ff_ff);
    // drawLineDDA(15, 10, 30, 80, 0xff_00_00_ff);

    // drawLineBresInt(10, 15, 80, 30, 0xff_00_00_ff);
    // drawLineBresIntBi(10, 15, 80, 30, 0xff_00_00_ff);
    // drawLineBresIntBiSym2(10, 15, 80, 30, 0xff_00_00_ff);
    // drawLineBresIntBiSym(10, 15, 80, 30, 0xff_00_ff_ff);

    // drawLineBresInt(45, 10, 70, 80, 0xff_00_ff_ff);
    // drawLineBresIntBiSym(45, 10, 70, 80, 0xff_00_00_ff);
    // drawLineBresInt(45, 10, 70, 80, 0xff_00_00_ff);
    // drawLineBresIntBiSym(45, 10, 70, 80, 0xff_00_ff_ff);
    // drawLineBresIntBiSym2(45, 10, 70, 80, 0xff_00_00_ff);
    // drawLineBresIntBi(45, 10, 70, 80, 0xff_00_ff_ff);

    // vert
    // lineAlgs.drawLineBresInt(15, 10, 600, 80, 0xff_ff_ff_ff);
    // lineAlgs.drawLineBresFloat(15, 10, 600, 80, 0xff_ff_ff_ff);
    // lineAlgs.drawLineDDA(15, 10, 600, 80, 0xff_ff_ff_ff);
    // lineAlgs.drawLineDDAFixed(15, 10, 600, 80, 0xff_ff_ff_ff);
    // lineAlgs.drawLineBresIntBiSym(15, 10, 600, 80, 0xff_ff_ff_ff);

    // lineAlgs.drawLineBresFloat(15, 10, 30, 80, 0xff_00_ff_ff);
    // drawLineDDA(15, 10, 30, 80, 0xff_00_ff_ff);
    // drawLineDDAFixed(15, 10, 30, 80, 0xff_00_00_ff);

    const NUM_LINES = 1000;
    for (let i = NUM_LINES; i--; ) {
      const x0 = (Math.random() * frameWidth) | 0;
      const y0 = (Math.random() * frameHeight) | 0;
      const x1 = (Math.random() * frameWidth) | 0;
      const y1 = (Math.random() * frameHeight) | 0;
      const r = (Math.random() * 255) | 0;
      const g = (Math.random() * 255) | 0;
      const b = (Math.random() * 255) | 0;
      // lineAlgs.drawLineBresIntBiSym2( // TODO: check infinite loop on some input. Check!
      lineAlgs.drawLineBresInt(
        x0,
        y0,
        x1,
        y1,
        (0xff << 24) + (b << 16) + (g << 8) + r,
      );
    }
    sleep(this.sleepArr, 0, 30);
  }
}

export type { LineDrawingParams };
export { LineDrawing };
