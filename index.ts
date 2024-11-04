import { AnchorRectangle } from "./src/models/rect";
import { Point } from "./src/models/point";
import { Path } from "./src/models/path";
import { ControlPanel } from "./src/models/control-panel";
import { Workbench } from "./src/models/workbench";
import { addPoints, subPoints } from "./src/utils";

const workbench = new Workbench("root", { width: 600, height: 480 });
const controlPanel = ControlPanel.getInstance();

const canvas = workbench.canvas;
canvas.addEventListener("pointerdown", drawPath);

let currentShape: AnchorRectangle | Path | null = null;

window.addEventListener("keydown", handleDelete);

function drawShapes() {
  const shapes = [...workbench.shapes.values()];
  if (currentShape) {
    shapes.push(currentShape);
  }
  workbench.drawShapes(shapes);
}
workbench.clearCanvas();

function drawRect(event: PointerEvent) {
  function drawRectCallback(event: PointerEvent) {
    const mousePoint: Point = {
      x: event.offsetX,
      y: event.offsetY,
    };
    if (currentShape instanceof AnchorRectangle) {
      currentShape.position = mousePoint;
      drawShapes();
    }
  }

  function drawRectEndCallback() {
    canvas.removeEventListener("pointermove", drawRectCallback);
    canvas.removeEventListener("pointerup", drawRectEndCallback);

    if (currentShape instanceof AnchorRectangle) {
      workbench.addShape(currentShape.toRect().toFigure());
    }

    currentShape = null;
    drawShapes();
  }

  const mousePoint: Point = {
    x: event.offsetX,
    y: event.offsetY,
  };

  currentShape = new AnchorRectangle(mousePoint, 0, 0, mousePoint);
  currentShape.applyControlOptions(controlPanel);

  canvas.addEventListener("pointermove", drawRectCallback);
  canvas.addEventListener("pointerup", drawRectEndCallback);
}

function selectTool(event: MouseEvent) {
  const shape = workbench.testPoint(event);
  const isShift = event.shiftKey;

  const startPosition: Point = {
    x: event.x,
    y: event.y,
  };

  if (!isShift) {
    workbench.unselectShapes();
  }
  if (shape) {
    workbench.selectShape(shape.id);
    const shapeOrigin = shape.origin;

    const pointerMove = function (event: MouseEvent) {
      const mousePos: Point = {
        x: event.x,
        y: event.y,
      };
      const diff = subPoints(mousePos, startPosition);
      shape.origin = addPoints(diff, shapeOrigin);
      drawShapes();
      workbench.selectShape(shape.id);
    };

    const pointerUp = function () {
      canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerup", pointerUp);
    };

    canvas.addEventListener("pointermove", pointerMove);
    canvas.addEventListener("pointerup", pointerUp);
  }
  drawShapes();
}

function drawPath(event: PointerEvent) {
  function drawPathCallback(event: PointerEvent) {
    const mousePoint: Point = {
      x: event.offsetX,
      y: event.offsetY,
    };

    if (currentShape instanceof Path) {
      currentShape.addPoint(mousePoint);
      drawShapes();
    }
  }

  function drawPathEndCallback() {
    canvas.removeEventListener("pointermove", drawPathCallback);
    canvas.removeEventListener("pointerup", drawPathEndCallback);

    workbench.addShape(currentShape!);
    currentShape = null;
    drawShapes();
  }

  const mousePoint: Point = {
    x: event.offsetX,
    y: event.offsetY,
  };

  currentShape = new Path();
  currentShape.applyControlOptions(controlPanel);
  currentShape.addPoint(mousePoint);
  canvas.addEventListener("pointermove", drawPathCallback);
  canvas.addEventListener("pointerup", drawPathEndCallback);
}

const applyStylesChange = () => {
  if (workbench.selectedShapes.size) {
    workbench.selectedShapes.forEach((id) => {
      workbench.shapes.get(id)!.applyControlOptions(controlPanel);
    });
    workbench.drawShapes();
  }
};

controlPanel.fillColorValue.subscribe(applyStylesChange);
controlPanel.lineColorValue.subscribe(applyStylesChange);
controlPanel.isFillValue.subscribe(applyStylesChange);
controlPanel.isStrokeValue.subscribe(applyStylesChange);
controlPanel.lineWidthValue.subscribe(applyStylesChange);

controlPanel.drawToolValue.subscribe((value) => {
  canvas.removeEventListener("pointerdown", drawPath);
  canvas.removeEventListener("pointerdown", drawRect);
  canvas.removeEventListener("pointerdown", selectTool);

  switch (value) {
    case "rect": {
      canvas.addEventListener("pointerdown", drawRect);
      break;
    }
    case "path": {
      canvas.addEventListener("pointerdown", drawPath);
      break;
    }
    case "select": {
      canvas.addEventListener("pointerdown", selectTool);
      break;
    }
  }
});

function handleDelete(event: KeyboardEvent) {
  if (event.key === "Delete" || event.key === "Backspace") {
    workbench.deleteSelectedShapes();
    drawShapes();
  }
}
