export class ColorId {
  public readonly value: number;
  public readonly color: string;

  constructor(seed: number) {
    this.value = seed;

    const red = (this.value & 0xff0000) >> 16;
    const green = (this.value & 0x00ff00) >> 8;
    const blue = this.value & 0x0000ff;

    this.color = `rgb(${red},${green},${blue})`;
  }

  public static getColorId(color: [number, number, number, number]) {
    const [r, g, b] = color;
    return (r << 16) | (g << 8) | b;
  }
}
