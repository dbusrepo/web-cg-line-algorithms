import assert from 'assert';

type DrawParams = {
  buf8: Uint8ClampedArray;
  buf32: Uint32Array;
  width: number;
  height: number;
};

// eslint-disable-next-line import/no-mutable-exports
let frameParams: DrawParams;

function initFrameParams(
  buffer: Uint8ClampedArray,
  width: number,
  height: number,
) {
  frameParams = {
    buf8: buffer,
    buf32: new Uint32Array(
      buffer.buffer,
      0,
      buffer.byteLength / Int32Array.BYTES_PER_ELEMENT,
    ),
    width,
    height,
  };
}

function fillBackgrnd(color: number) {
  frameParams.buf32.fill(color);
}

function drawPixel(x: number, y: number, color: number) {
  frameParams.buf32[y * frameParams.width + x] = color | 0;
}

function drawHLine(x0: number, x1: number, y: number, color: number) {
  if (x0 > x1) {
    let t = x0;
    x0 = x1;
    x1 = t;
  }
  const frameBuf = frameParams.buf32;
  // let curAddr = y * frameParams.width + x0;
  // let endAddr = curAddr - x0 + x1;
  // while (curAddr <= endAddr) {
  //   framePtr[curAddr++] = color;
  // }
  let startAddr = y * frameParams.width + x0;
  let endAddr = startAddr - x0 + x1 + 1;
  frameBuf.fill(color, startAddr, endAddr);
}

function drawVLine(x: number, y0: number, y1: number, color: number) {
  if (y0 > y1) {
    let t = y0;
    y0 = y1;
    y1 = t;
  }
  const frameBuf = frameParams.buf32;
  const { width } = frameParams;
  let curAddr = y0 * width + x;
  let endAddr = y1 * width + x;
  while (curAddr !== endAddr) {
    frameBuf[curAddr] = color;
    curAddr += width;
  }
  frameBuf[curAddr] = color;
}

function drawDLine(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: number,
) {
  if (x0 > x1) {
    let t = x0;
    x0 = x1;
    x1 = t;
    t = y0;
    y0 = y1;
    y1 = t;
  }
  const frameBuf = frameParams.buf32;
  const { width } = frameParams;
  const yOffs = (y1 - y0 > 0 ? width : -width) + 1;
  let curAddr = y0 * width + x0;
  let endAddr = y1 * width + x1;
  while (curAddr !== endAddr) {
    frameBuf[curAddr] = color;
    curAddr += yOffs;
  }
  frameBuf[curAddr] = color;
}

function drawLineBresFloat(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: number,
) {
  let dx = x1 - x0;
  let dy = y1 - y0;
  const adx = dx < 0 ? -dx : dx;
  const ady = dy < 0 ? -dy : dy;

  if (adx > ady) {
    if (x0 > x1) {
      let t = x0;
      x0 = x1;
      x1 = t;
      t = y0;
      y0 = y1;
      y1 = t;
      dy = -dy;
    }
    const frameBuf = frameParams.buf32;
    const { width } = frameParams;
    const yOffs = dy > 0 ? width : -width;
    let curAddr = y0 * width + x0;
    let endAddr = y1 * width + x1;
    let err = -0.5 + 0.0001;
    let m = ady / adx;
    for (;;) {
      frameBuf[curAddr] = color;
      if (curAddr === endAddr) break;
      curAddr++;
      err += m;
      if (err >= 0) {
        curAddr += yOffs;
        err -= 1;
      }
    }
    // let err = -0.5;
    // const yOffs = dy > 0 ? 1 : -1;
    // console.log('Bresenham: ', m);
    // let y = y0;
    // for (let x = x0; x <= x1; ++x) {
    //   if (y === y0 + 1) console.log(x, y, err);
    //   frameBuf[y * width + x] = color;
    //   err += m;
    //   if (err >= -0.0001) { // -esp to avoid small values skip y inc
    //     y += yOffs;
    //     err -= 1;
    //   }
    // }
  } else {
    if (y0 > y1) {
      let t = x0;
      x0 = x1;
      x1 = t;
      t = y0;
      y0 = y1;
      y1 = t;
      dx = -dx;
    }
    const frameBuf = frameParams.buf32;
    const { width } = frameParams;
    const xOffs = dx > 0 ? 1 : -1;
    let curAddr = y0 * width + x0;
    let endAddr = y1 * width + x1;
    let err = -0.5 + 0.0001;
    let m = adx / ady;
    for (;;) {
      frameBuf[curAddr] = color;
      if (curAddr === endAddr) break;
      curAddr += width;
      err += m;
      if (err >= 0) {
        curAddr += xOffs;
        err -= 1;
      }
    }
  }
}

function drawLineDDA(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: number,
) {
  let dx = x1 - x0;
  let dy = y1 - y0;
  const adx = dx < 0 ? -dx : dx;
  const ady = dy < 0 ? -dy : dy;

  if (adx > ady) {
    if (x0 > x1) {
      let t = x0;
      x0 = x1;
      x1 = t;
      t = y0;
      y0 = y1;
      y1 = t;
      dy = -dy;
    }
    const frameBuf = frameParams.buf32;
    const { width } = frameParams;
    let m = dy / adx;
    let y = y0 + 0.5;
    for (let x = x0; x <= x1; ++x) {
      // if (y0 + 1 === (y | 0)) console.log(x, y, y | 0);
      frameBuf[(y | 0) * width + x] = color;
      y += m;
    }
  } else {
    if (y0 > y1) {
      let t = x0;
      x0 = x1;
      x1 = t;
      t = y0;
      y0 = y1;
      y1 = t;
      dx = -dx;
    }
    const frameBuf = frameParams.buf32;
    const { width } = frameParams;
    let m = dx / ady;
    let x = x0 + 0.5;
    for (let y = y0; y <= y1; ++y) {
      frameBuf[y * width + (x | 0)] = color;
      x += m;
    }
  }
}

function drawLineBresInt(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: number,
) {
  let dx = x1 - x0;
  let dy = y1 - y0;
  const adx = dx < 0 ? -dx : dx;
  const ady = dy < 0 ? -dy : dy;

  if (adx > ady) {
    if (x0 > x1) {
      let t = x0;
      x0 = x1;
      x1 = t;
      t = y0;
      y0 = y1;
      y1 = t;
      dy = -dy;
    }
    const frameBuf = frameParams.buf32;
    const { width } = frameParams;
    const yOffs = dy > 0 ? width : -width;
    let curAddr = y0 * width + x0;
    let endAddr = y1 * width + x1;
    let err = -adx;
    let m = ady << 1;
    let c = adx << 1;
    for (;;) {
      frameBuf[curAddr] = color;
      if (curAddr++ === endAddr) break;
      err += m;
      if (err >= 0) {
        curAddr += yOffs;
        err -= c;
      }
    }
  } else {
    if (y0 > y1) {
      let t = x0;
      x0 = x1;
      x1 = t;
      t = y0;
      y0 = y1;
      y1 = t;
      dx = -dx;
    }
    const frameBuf = frameParams.buf32;
    const { width } = frameParams;
    const xOffs = dx > 0 ? 1 : -1;
    let curAddr = y0 * width + x0;
    let endAddr = y1 * width + x1;
    let err = -ady;
    let m = adx << 1;
    let c = ady << 1;
    for (;;) {
      frameBuf[curAddr] = color;
      if (curAddr === endAddr) break;
      curAddr += width;
      err += m;
      if (err >= 0) {
        curAddr += xOffs;
        err -= c;
      }
    }
  }
}

function drawLineDDAFixed(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: number,
) {
  let dx = x1 - x0;
  let dy = y1 - y0;
  const adx = dx < 0 ? -dx : dx;
  const ady = dy < 0 ? -dy : dy;

  if (adx > ady) {
    if (x0 > x1) {
      let t = x0;
      x0 = x1;
      x1 = t;
      t = y0;
      y0 = y1;
      y1 = t;
      dy = -dy;
    }
    let cr = 0.001;
    if (dy < 0) cr = -cr;
    const frameBuf = frameParams.buf32;
    const { width } = frameParams;
    let m = ((dy * (1 << 16)) / adx) | 0;
    let y = ((y0 + 0.5 + cr) * (1 << 16)) | 0;
    for (let x = x0; x <= x1; ++x) {
      frameBuf[(y >>> 16) * width + x] = color;
      y += m;
    }
  } else {
    if (y0 > y1) {
      let t = x0;
      x0 = x1;
      x1 = t;
      t = y0;
      y0 = y1;
      y1 = t;
      dx = -dx;
    }
    let cr = 0.001;
    if (dx < 0) cr = -cr;
    const frameBuf = frameParams.buf32;
    const { width } = frameParams;
    let m = ((dx * (1 << 16)) / ady) | 0;
    let x = ((x0 + 0.5 + cr) * (1 << 16)) | 0;
    for (let y = y0; y <= y1; ++y) {
      frameBuf[y * width + (x >>> 16)] = color;
      x += m;
    }
  }
}

function drawLineBresIntBiSym(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: number,
) {
  let dx = x1 - x0;
  let dy = y1 - y0;
  const adx = dx < 0 ? -dx : dx;
  const ady = dy < 0 ? -dy : dy;

  if (adx > ady) {
    if (x0 > x1) {
      let t = x0;
      x0 = x1;
      x1 = t;
      t = y0;
      y0 = y1;
      y1 = t;
      dy = -dy;
    }
    // assert(adx + 1 >= 2);
    const frameBuf = frameParams.buf32;
    const { width } = frameParams;
    const yOffs = dy > 0 ? width : -width;
    let m = ady << 1;
    let c = adx << 1;
    const xend = (adx + 1) >>> 1;
    const left = (adx + 1) & 1;
    let curAddr = y0 * width + x0;
    let curAddr1 = y1 * width + x1;
    let err = -adx;
    for (let x = 0; x !== xend; ++x) {
      frameBuf[curAddr++] = color;
      frameBuf[curAddr1--] = color;
      err += m;
      if (err >= 0) {
        curAddr += yOffs;
        curAddr1 -= yOffs;
        err -= c;
      }
    }
    if (left) {
      frameBuf[curAddr] = color;
    }
  } else {
    if (y0 > y1) {
      let t = x0;
      x0 = x1;
      x1 = t;
      t = y0;
      y0 = y1;
      y1 = t;
      dx = -dx;
    }
    const frameBuf = frameParams.buf32;
    const { width } = frameParams;
    const xOffs = dx > 0 ? 1 : -1;
    const yend = (ady + 1) >>> 1;
    const left = (ady + 1) & 1;
    let m = adx << 1;
    let c = ady << 1;
    let curAddr = y0 * width + x0;
    let curAddr1 = y1 * width + x1;
    let err = -ady;
    for (let y = 0; y !== yend; ++y) {
      frameBuf[curAddr] = color;
      frameBuf[curAddr1] = color;
      curAddr += width;
      curAddr1 -= width;
      err += m;
      if (err >= 0) {
        curAddr += xOffs;
        curAddr1 -= xOffs;
        err -= c;
      }
    }
    if (left) {
      frameBuf[curAddr] = color;
    }
  }
}

function drawLineBresIntBiSym2(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: number,
) {
  let dx = x1 - x0;
  let dy = y1 - y0;
  const adx = dx < 0 ? -dx : dx;
  const ady = dy < 0 ? -dy : dy;

  if (adx > ady) {
    if (x0 > x1) {
      let t = x0;
      x0 = x1;
      x1 = t;
      t = y0;
      y0 = y1;
      y1 = t;
      dy = -dy;
    }
    // assert(adx + 1 >= 2);
    const frameBuf = frameParams.buf32;
    const { width } = frameParams;
    const yOffs = dy > 0 ? width : -width;
    let m = ady << 1;
    let c = adx << 1;
    let err = m - adx;
    const xend = (adx - 1) >>> 1;
    const left = (adx - 1) & 1;
    let curAddr = y0 * width + x0;
    let curAddr1 = y1 * width + x1;
    frameBuf[curAddr] = color;
    frameBuf[curAddr1] = color;
    for (let x = 0; x !== xend; ++x) {
      curAddr++;
      curAddr1--;
      if (err >= 0) {
        curAddr += yOffs;
        curAddr1 -= yOffs;
        err -= c;
      }
      err += m;
      frameBuf[curAddr] = color;
      frameBuf[curAddr1] = color;
    }
    if (left) {
      if (err >= 0) {
        curAddr += yOffs;
      }
      frameBuf[++curAddr] = color;
    }
  } else {
    if (y0 > y1) {
      let t = x0;
      x0 = x1;
      x1 = t;
      t = y0;
      y0 = y1;
      y1 = t;
      dx = -dx;
    }
    // assert(ady + 1 >= 2);
    const frameBuf = frameParams.buf32;
    const { width } = frameParams;
    const xOffs = dx > 0 ? 1 : -1;
    let m = adx << 1;
    let c = ady << 1;
    let err = m - ady;
    const yend = (ady - 1) >>> 1;
    const left = (ady - 1) & 1;
    let curAddr = y0 * width + x0;
    let curAddr1 = y1 * width + x1;
    frameBuf[curAddr] = color;
    frameBuf[curAddr1] = color;
    for (let y = 0; y !== yend; ++y) {
      curAddr += width;
      curAddr1 -= width;
      if (err >= 0) {
        curAddr += xOffs;
        curAddr1 -= xOffs;
        err -= c;
      }
      err += m;
      frameBuf[curAddr] = color;
      frameBuf[curAddr1] = color;
    }
    if (left) {
      if (err >= 0) {
        curAddr += xOffs;
      }
      frameBuf[curAddr + width] = color;
    }
  }
}

// bidirectional but not symmetrical, so same lines as in Bresenham
function drawLineBresIntBi(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: number,
) {
  let dx = x1 - x0;
  let dy = y1 - y0;
  const adx = dx < 0 ? -dx : dx;
  const ady = dy < 0 ? -dy : dy;

  if (adx > ady) {
    if (x0 > x1) {
      let t = x0;
      x0 = x1;
      x1 = t;
      t = y0;
      y0 = y1;
      y1 = t;
      dy = -dy;
    }
    // assert(adx + 1 >= 2);
    const frameBuf = frameParams.buf32;
    const { width } = frameParams;
    const yOffs = dy > 0 ? width : -width;
    let m = ady << 1;
    let c = adx << 1;
    let err = m - adx;
    const xend = (adx - 1) >>> 1;
    const left = (adx - 1) & 1;
    let curAddr = y0 * width + x0;
    let curAddr1 = y1 * width + x1;
    frameBuf[curAddr] = color;
    frameBuf[curAddr1] = color;
    for (let x = 0; x !== xend; ++x) {
      curAddr++;
      curAddr1--;
      if (err >= 0) {
        curAddr += yOffs;
        frameBuf[curAddr] = color;
        if (err > 0) {
          curAddr1 -= yOffs;
          frameBuf[curAddr1] = color;
        } else {
          frameBuf[curAddr1] = color;
          curAddr1 -= yOffs;
        }
        err -= c;
      } else {
        frameBuf[curAddr] = color;
        frameBuf[curAddr1] = color;
      }
      err += m;
    }
    if (left) {
      if (err >= 0) {
        curAddr += yOffs;
      }
      frameBuf[++curAddr] = color;
    }
  } else {
    if (x0 > x1) {
      let t = x0;
      x0 = x1;
      x1 = t;
      t = y0;
      y0 = y1;
      y1 = t;
      dy = -dy;
    }
    // assert(ady + 1 >= 2);
    const frameBuf = frameParams.buf32;
    const { width } = frameParams;
    const xOffs = dx > 0 ? 1 : -1;
    let m = adx << 1;
    let c = ady << 1;
    let err = m - ady;
    const yend = (ady - 1) >>> 1;
    const left = (ady - 1) & 1;
    let curAddr = y0 * width + x0;
    let curAddr1 = y1 * width + x1;
    frameBuf[curAddr] = color;
    frameBuf[curAddr1] = color;
    for (let y = 0; y !== yend; ++y) {
      curAddr += width;
      curAddr1 -= width;
      if (err >= 0) {
        curAddr += xOffs;
        frameBuf[curAddr] = color;
        if (err > 0) {
          curAddr1 -= xOffs;
          frameBuf[curAddr1] = color;
        } else {
          frameBuf[curAddr1] = color;
          curAddr1 -= xOffs;
        }
        err -= c;
      } else {
        frameBuf[curAddr] = color;
        frameBuf[curAddr1] = color;
      }
      err += m;
    }
    if (left) {
      if (err >= 0) {
        curAddr += xOffs;
      }
      frameBuf[curAddr + width] = color;
    }
  }
}

function drawLine(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: number,
) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  if (dx === 0) {
    drawVLine(x0, y0, y1, color);
    return;
  }
  if (dy === 0) {
    drawHLine(x0, x1, y0, color);
    return;
  }
  if (Math.abs(dx) === Math.abs(dy)) {
    drawDLine(x0, y0, x1, y1, color);
    return;
  }
  // drawLineBresFloat(x0, y0, x1, y1, color);
  drawLineDDA(x0, y0, x1, y1, color);
}

export {
  initFrameParams,
  fillBackgrnd,
  drawLineBresIntBi,
  drawLineBresIntBiSym2, // TODO: check
  drawLineBresIntBiSym,
  drawLineBresInt,
  drawLineBresFloat,
  drawLineDDA,
  drawLineDDAFixed,
  drawLine,
};
