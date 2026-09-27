import { dlopen, FFIType, ptr, type Pointer } from 'bun:ffi';

const config = {
  coreGraphicsPath:
    '/System/Library/Frameworks/CoreGraphics.framework/CoreGraphics',
  eventTap: 0,
  mouseEvent: { moved: 5, leftDown: 1, leftUp: 2 },
  keyCode: { any: 0, return: 36, escape: 53 },
  glideStepsPerSecond: 60,
  clickHoldMs: 50,
  typingDelayMs: 60,
  focusDelayMs: 600,
};

const { symbols: coreGraphics } = dlopen(config.coreGraphicsPath, {
  CGEventCreateMouseEvent: {
    args: [FFIType.ptr, FFIType.u32, FFIType.f64, FFIType.f64, FFIType.u32],
    returns: FFIType.ptr,
  },
  CGEventCreateKeyboardEvent: {
    args: [FFIType.ptr, FFIType.u16, FFIType.bool],
    returns: FFIType.ptr,
  },
  CGEventKeyboardSetUnicodeString: {
    args: [FFIType.ptr, FFIType.u64, FFIType.ptr],
    returns: FFIType.void,
  },
  CGEventPost: { args: [FFIType.u32, FFIType.ptr], returns: FFIType.void },
  CFRelease: { args: [FFIType.ptr], returns: FFIType.void },
});

export type Point = { x: number; y: number };

const postAndRelease = (event: Pointer | null) => {
  coreGraphics.CGEventPost(config.eventTap, event);
  coreGraphics.CFRelease(event);
};

const postMouse = (type: number, point: Point) =>
  postAndRelease(
    coreGraphics.CGEventCreateMouseEvent(null, type, point.x, point.y, 0),
  );

const easeInOut = (progress: number) => 0.5 - Math.cos(Math.PI * progress) / 2;

const interpolate = (from: Point, to: Point, progress: number): Point => ({
  x: from.x + (to.x - from.x) * progress,
  y: from.y + (to.y - from.y) * progress,
});

export class Mouse {
  #position: Point;

  constructor(start: Point) {
    this.#position = start;
    postMouse(config.mouseEvent.moved, start);
  }

  async glide(target: Point, seconds = 0.6) {
    const from = this.#position;
    const steps = Math.max(1, Math.round(seconds * config.glideStepsPerSecond));
    for (let step = 1; step <= steps; step++) {
      postMouse(
        config.mouseEvent.moved,
        interpolate(from, target, easeInOut(step / steps)),
      );
      await Bun.sleep(1000 / config.glideStepsPerSecond);
    }
    this.#position = target;
  }

  async click(target: Point, seconds = 0.6) {
    await this.glide(target, seconds);
    postMouse(config.mouseEvent.leftDown, target);
    await Bun.sleep(config.clickHoldMs);
    postMouse(config.mouseEvent.leftUp, target);
  }
}

const pressKey = (keyCode: number, text?: string) =>
  [true, false].forEach((keyDown) => {
    const event = coreGraphics.CGEventCreateKeyboardEvent(
      null,
      keyCode,
      keyDown,
    );
    if (text) {
      const characters = new Uint16Array(
        [...text].map((character) => character.charCodeAt(0)),
      );
      coreGraphics.CGEventKeyboardSetUnicodeString(
        event,
        characters.length,
        ptr(characters),
      );
    }
    postAndRelease(event);
  });

export const keyboard = {
  async type(text: string) {
    for (const character of text) {
      pressKey(config.keyCode.any, character);
      await Bun.sleep(config.typingDelayMs);
    }
  },
  pressReturn: () => pressKey(config.keyCode.return),
  pressEscape: () => pressKey(config.keyCode.escape),
};

export const focusProcess = async (processName: string) => {
  await Bun.$`osascript -e ${`tell application "System Events" to set frontmost of process "${processName}" to true`}`.quiet();
  await Bun.sleep(config.focusDelayMs);
};
