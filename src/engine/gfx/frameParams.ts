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

export { initFrameParams, frameParams };
