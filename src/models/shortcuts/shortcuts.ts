type Options = {
  ctrl?: boolean;
  shift?: boolean;
};

export class Shortcuts {
  private keyShortcuts: Map<string, () => void> = new Map();

  constructor() {
    window.addEventListener("keydown", this.executeShortcut);
  }

  set(code: string, callback: () => void, options?: Options) {
    this.keyShortcuts.set(this.createKey(code, options), callback);
  }

  get(code: string, options?: Options) {
    return this.keyShortcuts.get(this.createKey(code, options));
  }

  delete(code: string, options?: Options) {
    this.keyShortcuts.delete(this.createKey(code, options));
  }

  private createKey = (code: string, options?: Options) => {
    const isCtrl = options?.ctrl ? "ctrl+" : "";
    const isShift = options?.shift ? "shift+" : "";
    return `${isCtrl}${isShift}${code}`;
  };

  private executeShortcut = (event: KeyboardEvent) => {
    const ctrl = event.ctrlKey;
    const shift = event.shiftKey;
    const meta = event.metaKey;

    const callback = this.get(event.code, {
      ctrl: ctrl || meta,
      shift,
    });

    if (callback) {
      callback();
    }
  };
}
