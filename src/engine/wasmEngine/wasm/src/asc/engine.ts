import { myAssert } from './myAssert';
import { initSharedHeap } from './sharedHeapAlloc';
import {
  initMemManager,
  alloc,
  free,
} from './workerHeapManager';
import { ArenaAlloc, newArena } from './arenaAlloc';
import { ObjectAllocator } from './objectAllocator';
import * as utils from './utils';
import * as draw from './draw';
import {
  sharedHeapPtr,
  numWorkers,
  mainWorkerIdx,
  workerIdx,
  logi,
  logf,
  rgbaSurface0ptr,
  rgbaSurface0width,
  rgbaSurface0height,
  syncArrayPtr,
  sleepArrayPtr,
  hrTimerPtr,
  frameColorRGBAPtr,
  texturesPtr,
  mipmapsPtr,
} from './importVars';
import { Texture, initTextures, initMipMaps } from './texture';
import { BitImageRGBA } from './bitImageRGBA';
// import { DArray, newDArray, deleteDArray } from './darray';
import { Pointer } from './pointer';
import { SArray, newSArray } from './sarray';
import { DArray, newDArray } from './darray';
import { test } from './test/test';
import { PTR_T, SIZE_T, NULL_PTR } from './memUtils';
import {
  FrameColorRGBA, 
  newFrameColorRGBA,
  // deleteFrameColorRGBA, 
  MAX_LIGHT_LEVELS,
  BPP_RGBA,
  getRedLightTablePtr,
  getGreenLightTablePtr,
  getBlueLightTablePtr,
  getRedFogTablePtr,
  getGreenFogTablePtr,
  getBlueFogTablePtr,
} from './frameColorRGBA';

const syncLoc = utils.getArrElPtr<i32>(syncArrayPtr, workerIdx);
const sleepLoc = utils.getArrElPtr<i32>(sleepArrayPtr, workerIdx);

const MAIN_THREAD_IDX = mainWorkerIdx;

let frameColorRGBA = changetype<FrameColorRGBA>(NULL_PTR);

let textures = changetype<SArray<Texture>>(NULL_PTR);
let mipmaps = changetype<SArray<BitImageRGBA>>(NULL_PTR);

function getFrameColorRGBAPtr(): PTR_T {
  return changetype<PTR_T>(frameColorRGBA);
}

function getTexturesPtr(): PTR_T {
  return changetype<PTR_T>(textures);
}

function getMipMapsPtr(): PTR_T {
  return changetype<PTR_T>(mipmaps);
}

function initData(): void {
  if (workerIdx == MAIN_THREAD_IDX) {
    frameColorRGBA = newFrameColorRGBA();
    textures = initTextures();
    mipmaps = initMipMaps(textures);
  } else {
    frameColorRGBA = changetype<FrameColorRGBA>(frameColorRGBAPtr);
    textures = changetype<SArray<Texture>>(texturesPtr);
    mipmaps = changetype<SArray<BitImageRGBA>>(mipmapsPtr);
  }
}

function init(): void {
  if (workerIdx == MAIN_THREAD_IDX) {
    initSharedHeap();
    // logi(align<u64>());
    // logi(hrTimerPtr);
    // const t0 = <u64>process.hrtime();
    // draw.clearBg(0, frameHeight, 0xff_00_00_00);
    // const t1 = <u64>process.hrtime();
    // store<u64>(hrTimerPtr, t1 - t0);
  }

  // logi(workerIdx as i32);
  initMemManager();
  initData();
}

function render(): void {

  // utils.sleep(sleepLoc, 1);

  const r = utils.range(workerIdx, numWorkers, rgbaSurface0height);
  const s = <usize>(r >> 32);
  const e = <usize>r;
  // logi(r as i32);

  // const t0 = <u64>process.hrtime();

  draw.clearBg(s, e, 0xff_00_00_00); // ABGR

  // if (workerIdx == MAIN_THREAD_IDX) {
    // const color1 = FrameColorRGBA.colorABGR(0xff, 0, 0, 0xff);
    // for (let l = 0; l < MAX_LIGHT_LEVELS; ++l) {
    //   const color2 = frameColorRGBA.lightColorABGR(color1, l);
    //   // const color2 = frameColorRGBA.fogColorABGR(color1, l);
    //   drawQuad(0, l * 2, 100, 2, color2);
    // }
  // }

  // const t1 = <u64>process.hrtime();
  // store<u64>(hrTimerPtr, t1 - t0);

  // render tex mips test
  // const tex = textures.at(0);
  // // const image = mipmaps.at(0);
  // // const byte = load<u8>(image.Ptr);
  // // logi(<i32>byte);

  // const tex = textures.at(0);
  // if (workerIdx == MAIN_THREAD_IDX) {
  // // if (workerIdx == 1) {
  //   const mip = mipmaps.at(tex.gMipIdx(0));
  //   const minWidth = <SIZE_T>Math.min(mip.Width, rgbaSurface0width);
  //   const minHeight = <SIZE_T>Math.min(mip.Height, e - s);
  //   // const imagePitch = <SIZE_T>(1 << image.PitchLg2);
  //   // logi(minWidth as i32);
  //   // logi(minHeight as i32);
  //   for (let i = s; i != s + minHeight; ++i) {
  //     let screenPtr: PTR_T = rgbaSurface0ptr + i * rgbaSurface0width * BPP_RGBA;
  //     const texelsRowPtr: PTR_T = mip.Ptr + ((i - s) << mip.Lg2Pitch) * BPP_RGBA;
  //     memory.copy(screenPtr, texelsRowPtr, mip.Width * 4);
  //   }
  // }

  // if (workerIdx == MAIN_THREAD_IDX) {
    // draw.drawText(strings.SENT2, 10, 10, 1, 0xFF_00_00_FF);
    // draw.drawText(strings.SENT2, 10, 18, 2, 0xFF_00_00_FF);
    // let y = 20;
    // for (let s = 1; s < 5; ) {
    //   draw.drawText(strings.SENT2, 10, y, f32(s), 0xFF_00_00_FF);
    //   y += FONT_Y_SIZE * s;
    //   s++;
    // }
  // }
}

function run(): void {
  while (true) {
    if (workerIdx != MAIN_THREAD_IDX) {
      atomic.wait<i32>(syncLoc, 0);
    }

    // utils.sleep(sleepLoc, 16);
    render();

    if (workerIdx != MAIN_THREAD_IDX) {
      atomic.store<i32>(syncLoc, 0);
      atomic.notify(syncLoc);
    }
  }
}

// function run(): void {
//   // initWorkerMem();
//
//   // const p = alloc(32);
//   // const t = alloc(32);
//   // dealloc(p);
//   // logi(load<u32>(WORKER_MEM_COUNTER_PTR));
//
//   // logi(strings.MSG1);
//   // logi(strings.SENT2);
//   // logi(strings.SENT3);
//
//   // logi(load<u8>(fontCharsPtr + 65*8));
//
//   // logi(load<u8>(stringsDataPtr));
//   // logi(load<u8>(stringsDataPtr+1));
//   // logi(load<u8>(stringsDataPtr+2));
//   // logi(load<u8>(stringsDataPtr+3));
//   // logi(load<u8>(stringsDataPtr+4));
//
//   // logi(stringsIndexPtr);
//   // logi(stringsIndexSize);
//   // logi(stringsDataPtr);
//   // logi(stringsDataSize);
//
//   // logi(fontCharsPtr);
//   // logi(fontCharsSize);
//
//   // logi(MYIMG);
//
//   // test();
//   // test images loading
//   // const images = initImages();
//   // for (let i = 0; i < images.length(); ++i) {
//   //   const pixels = images.at(i).pixels;
//   //   logi(<i32>pixels);
//   //   const byte = load<u8>(pixels);
//   //   logi(byte);
//   //   logi(images.at(i).width);
//   //   logi(images.at(i).height);
//   // }
//
//   const images = initImages();
//   const image = images.at(0);
//
//   // const width = image.width;
//   // const height = image.height;
//
//   // let screenPtr: PTR_T;
//   // let pixels: PTR_T;
//
//   // logi(imagesIndexOffset);
//   // logi(image.pixels);
//   // logi(image.width);
//   // logi(image.height);
//   // for (let i = 0; i != frameHeight; ++i) {
//   //   let screenPtr: PTR_T = frameBufferPtr + i * frameWidth * 4;
//   //   const pixels: PTR_T = image.pixels + i * image.width * 4;
//   //   memory.copy(screenPtr, pixels, frameWidth * 4);
//
//   //   // screenPtr = frameBufferPtr + i * frameWidth * 4;
//   //   // pixels = image.pixels + i * image.width * 4;
//   //   // // logi(screenPtr);
//   //   // for (let j = 0; j != frameWidth; ++j) {
//   //   //   const col = load<u32>(pixels);
//   //   //   store<u32>(screenPtr, col);
//   //   //   // store<i32>(screenPtr, 0xFF_00_00_FF);
//   //   //   pixels += 4;
//   //   //   screenPtr += 4;
//   //   //   // logi(j);
//   //   // }
//   // }
//
//   const r = utils.range(workerIdx, numWorkers, frameHeight);
//   const s = <u32>(r >> 32);
//   const e = <u32>r;
//
//   // logi(<i32>process.hrtime())
//
//   // logi(sleepLoc);
//   // logi(load<u32>(sleepLoc));
//
//   draw.clearBg(s, e, 0xff_00_00_00); // ABGR
// }

function drawQuad(x: i32, y: i32, w: i32, h: i32, colorARGB: u32): void {
  for (let i = 0; i < h; ++i) {
    const rowPtr = rgbaSurface0ptr + (y + i) * rgbaSurface0width * BPP_RGBA
    for (let j = 0; j < w; ++j) {
      const screenPtr = rowPtr + (x + j) * BPP_RGBA;
      store<u32>(screenPtr, colorARGB);
    }
  }
}

export { 
  init, render, run,
  getFrameColorRGBAPtr,
  getRedLightTablePtr,
  getGreenLightTablePtr,
  getBlueLightTablePtr,
  getRedFogTablePtr,
  getGreenFogTablePtr,
  getBlueFogTablePtr,

  getTexturesPtr,
  getMipMapsPtr,
};
