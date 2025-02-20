import React, { useState } from "react";
import Sketch from "react-p5";
import "./DrawComponent.css";

const DrawComponent = () => {
  const [isMouseOverCanvas, setIsMouseOverCanvas] = useState(false);
  const [drawnShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState("ellipse");
  const [currentDrawing, setCurrentDrawing] = useState([]);
  const [lineStart, setLineStart] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState("#242424");
  const [shapeColor, setShapeColor] = useState("#14DCEB");
  const [lineThickness, setLineThickness] = useState(1);
  const [textToPrint, setTextToPrint] = useState(""); // Nuevo estado para almacenar el texto a imprimir

  const setup = (p5, canvasParentRef) => {
    const canvasWidth = Math.min(window.innerWidth, 1024);
    const canvasHeight = canvasWidth * (2 / 3);

    const canvas = p5.createCanvas(canvasWidth, canvasHeight);
    canvas.parent(canvasParentRef);
    canvas.style("display", "block");
    canvas.style("margin", "auto");
    canvas.style("user-select", "none");
    canvas.style("touch-action", "none");
    canvas.style("border", "1px solid black");

    p5.frameRate(60);
  };

  const draw = (p5) => {
    p5.background(backgroundColor);

    setIsMouseOverCanvas(
      p5.mouseX > 0 &&
        p5.mouseX < p5.width &&
        p5.mouseY > 0 &&
        p5.mouseY < p5.height
    );

    if (p5.mouseIsPressed && isMouseOverCanvas) {
      if (currentShape === "ellipse") {
        const ellipseShape = {
          type: "ellipse",
          x: p5.mouseX,
          y: p5.mouseY,
          size: 5,
          color: shapeColor,
        };
        setCurrentDrawing([...currentDrawing, ellipseShape]);
      } else if (currentShape === "line" && !lineStart) {
        setLineStart({ x: p5.mouseX, y: p5.mouseY });
      } else if (currentShape === "line" && lineStart) {
        const lineShape = {
          type: "line",
          startX: lineStart.x,
          startY: lineStart.y,
          endX: p5.mouseX,
          endY: p5.mouseY,
          color: shapeColor,
        };
        setCurrentDrawing([...currentDrawing, lineShape]);
      } else if (currentShape === "snowflake") {
        const snowflakeShape = {
          type: "snowflake",
          x: p5.mouseX,
          y: p5.mouseY,
          color: shapeColor,
        };
        setCurrentDrawing([...currentDrawing, snowflakeShape]);
      }
    }

    p5.strokeWeight(lineThickness);

    // Dibujar las formas en drawnShapes
    for (const shapes of drawnShapes) {
      for (const shape of shapes) {
        p5.stroke(shape.color);
        if (shape.type === "ellipse") {
          p5.ellipse(shape.x, shape.y, shape.size, shape.size);
        } else if (shape.type === "line") {
          p5.line(shape.startX, shape.startY, shape.endX, shape.endY);
        } else if (shape.type === "snowflake"
        ) {
          p5.text("*", shape.x, shape.y);
        }
      }
    }

    for (const shape of currentDrawing) {
      p5.stroke(shape.color);
      if (shape.type === "ellipse") {
        p5.ellipse(shape.x, shape.y, shape.size, shape.size);
      } else if (shape.type === "line") {
        p5.line(shape.startX, shape.startY, shape.endX, shape.endY);
      } else if (shape.type === "snowflake") {
        // Usar el texto ingresado por el usuario en lugar de un texto fijo
        p5.textStyle(p5.BOLD); // Aplicar negrita
        p5.textFont("Array"); // Establecer la fuente en "Array"
        p5.text(textToPrint, shape.x, shape.y);
      }
    }
  };

  const handleEllipseClick = () => {
    setCurrentShape("ellipse");
  };

  const handleLineClick = () => {
    setCurrentShape("line");
  };

  const handleSnowflakeClick = () => {
    setCurrentShape("snowflake");
  };

  const handleBackgroundColorChange = (event) => {
    setBackgroundColor(event.target.value);
  };

  const handleShapeColorChange = (event) => {
    setShapeColor(event.target.value);
  };

  const handleLineThicknessChange = (event) => {
    setLineThickness(parseInt(event.target.value));
  };

  const handleTextChange = (event) => {
    setTextToPrint(event.target.value);
  };

  return (
    <div>
      <div className="sketch-controls">
        <label htmlFor="backgroundColor">BACKGROUND COLOR</label>
        <input
          type="color"
          id="backgroundColor"
          value={backgroundColor}
          onChange={handleBackgroundColorChange}
        />
        <label htmlFor="shapeColor">SHAPE COLOR</label>
        <input
          type="color"
          id="shapeColor"
          value={shapeColor}
          onChange={handleShapeColorChange}
        />
        <label htmlFor="lineThickness">SIZE</label>
        <input
          className="lineThickness"
          type="range"
          id="lineThickness"
          min="1"
          max="10"
          value={lineThickness}
          onChange={handleLineThicknessChange}
          style={{
            backgroundColor: "red",
            color: "white",
            border: "1px solid transparent",
          }}
        />
        <label htmlFor="textToPrint">Texto a imprimir:</label>
        <input
          type="text"
          id="textToPrint"
          value={textToPrint}
          onChange={handleTextChange}
        />
      </div>
      <div className="sketch-buttons">
        <button onClick={handleEllipseClick}>DRAW CIRCULE</button>
        <button onClick={handleLineClick}>DRAW LINES</button>
        <button onClick={handleSnowflakeClick}>DRAW CIRCULES</button>
      </div>
      <Sketch setup={setup} draw={draw} className="draw-container" />
    </div>
  );
};

export default DrawComponent;
