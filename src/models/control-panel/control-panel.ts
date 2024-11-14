import { ValueObserver } from "../value-observer";
import { Shortcuts } from "../shortcuts";

export class ControlPanel {
  private static instance: ControlPanel | null;
  private shortcuts: Shortcuts = new Shortcuts();

  private select: HTMLSelectElement;
  private fillColorInput: HTMLInputElement;
  private strokeColorInput: HTMLInputElement;
  private fillCheckbox: HTMLInputElement;
  private strokeCheckbox: HTMLInputElement;
  private lineWidthRange: HTMLInputElement;

  public fillColorValue: ValueObserver<string> = new ValueObserver("");
  public lineColorValue: ValueObserver<string> = new ValueObserver("");
  public isFillValue: ValueObserver<boolean> = new ValueObserver(true);
  public isStrokeValue: ValueObserver<boolean> = new ValueObserver(true);
  public lineWidthValue: ValueObserver<number> = new ValueObserver(1);
  public drawToolValue: ValueObserver<string> = new ValueObserver("");

  static getInstance(): ControlPanel {
    if (ControlPanel.instance) return ControlPanel.instance;
    ControlPanel.instance = new ControlPanel();
    return ControlPanel.instance;
  }

  private constructor() {
    this.select = document.getElementById("draw-tool") as HTMLSelectElement;

    this.fillColorInput = document.getElementById(
      "fillColor",
    ) as HTMLInputElement;
    this.strokeColorInput = document.getElementById(
      "strokeColor",
    ) as HTMLInputElement;
    this.fillCheckbox = document.getElementById("fill") as HTMLInputElement;
    this.strokeCheckbox = document.getElementById("stroke") as HTMLInputElement;
    this.lineWidthRange = document.getElementById(
      "lineWidth",
    ) as HTMLInputElement;

    this.drawToolValue.value = this.select.value;
    this.fillColorValue.value = this.fillColorInput.value;
    this.lineColorValue.value = this.strokeColorInput.value;
    this.isFillValue.value = this.fillCheckbox.checked;
    this.isStrokeValue.value = this.strokeCheckbox.checked;
    this.lineWidthValue.value = parseFloat(this.lineWidthRange.value);

    this.fillColorInput.addEventListener(
      "input",
      this.handleInputChange(this.fillColorValue),
    );
    this.strokeColorInput.addEventListener(
      "input",
      this.handleInputChange(this.lineColorValue),
    );
    this.fillCheckbox.addEventListener(
      "change",
      this.handleCheckboxChange(this.isFillValue),
    );
    this.strokeCheckbox.addEventListener(
      "change",
      this.handleCheckboxChange(this.isStrokeValue),
    );
    this.lineWidthRange.addEventListener(
      "input",
      this.handleRangeChange(this.lineWidthValue),
    );
    this.select.addEventListener(
      "change",
      this.handleInputChange(this.drawToolValue),
    );

    this.shortcuts.set("KeyP", this.selectDrawTool("path"));
    this.shortcuts.set("KeyR", this.selectDrawTool("rect"));
    this.shortcuts.set("KeyV", this.selectDrawTool("select"));
  }

  public fillColor = () => this.fillColorValue.value;
  public lineColor = () => this.lineColorValue.value;
  public isFill = () => this.isFillValue.value;
  public isStroke = () => this.isStrokeValue.value;
  public lineWidth = () => this.lineWidthValue.value;
  public drawTool = () => this.drawToolValue.value;

  private handleInputChange =
    (value: ValueObserver<string>) => (event: Event) => {
      value.value = (event.target as HTMLInputElement).value;
    };
  private handleRangeChange =
    (value: ValueObserver<number>) => (event: Event) => {
      value.value = parseFloat((event.target as HTMLInputElement).value);
    };
  private handleCheckboxChange =
    (value: ValueObserver<boolean>) => (event: Event) => {
      value.value = (event.target as HTMLInputElement).checked;
    };

  private selectDrawTool = (tool: "select" | "rect" | "path") => () => {
    this.select.value = tool;
    this.drawToolValue.value = tool;
  };
}
