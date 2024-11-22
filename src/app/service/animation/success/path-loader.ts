export function initPathLoader(el: SVGPathElement): PathLoader {
  return new PathLoader(el);
}

export class PathLoader {
  private el: SVGPathElement;
  private strokeLength: number;

  constructor(el: SVGPathElement) {
    this.el = el;
    this.strokeLength = el.getTotalLength();
    this.el.style.strokeDasharray = `${this.strokeLength}`;
    this.el.style.strokeDashoffset = `${this.strokeLength}`;
  }

  private _draw(val: number): void {
    this.el.style.strokeDashoffset = `${this.strokeLength * (1 - val)}`;
  }

  setProgress(val: number, cb?: () => void): void {
    this._draw(val);
    if (cb && typeof cb === 'function') cb();
  }

  setProgressFn(fn: (loader: PathLoader) => void): void {
    if (typeof fn === 'function') fn(this);
  }
}