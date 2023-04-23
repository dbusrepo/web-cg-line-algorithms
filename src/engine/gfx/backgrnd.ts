import { frameParams } from './frameParams';

function fillBackgrnd(color: number) {
  frameParams.buf32.fill(color);
}

export { fillBackgrnd };
