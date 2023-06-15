import SVGPathCommander, { PathArray } from "svg-path-commander";
import compact from "lodash/compact";
import { getViewBoxArea } from "./getViewBoxArea";
import { getClassesFromStyles } from "./getClassesFromStyles";

export type ShapeProps = {
  area: number;
  color: string;
};

type ElementProps = {
  color: string;
  path: PathArray;
};

export const getAreas = (svgText: string, realArea: number) => {
  const parser = new DOMParser();
  const svg = parser.parseFromString(svgText, "image/svg+xml");

  const classes = getClassesFromStyles(svg);

  const viewBoxArea = getViewBoxArea(svgText);

  const pathElements = Array.from(svg.getElementsByTagName("path"));
  const polygonElements = Array.from(svg.getElementsByTagName("polygon"));
  const ellipseElements = Array.from(svg.getElementsByTagName("ellipse"));
  const circleElements = Array.from(svg.getElementsByTagName("circle"));
  const rectElements = Array.from(svg.getElementsByTagName("rect"));

  const svgElements = [
    ...pathElements,
    ...polygonElements,
    ...ellipseElements,
    ...circleElements,
    ...rectElements,
  ] as SVGPathCommander.ShapeTypes[];

  const elements: ElementProps[] = compact(
    svgElements.map((svgElement) => {
      const fill = svgElement.getAttribute("fill");
      const className = svgElement.getAttribute("class");

      const newElement =
        svgElement.tagName !== "path"
          ? SVGPathCommander.shapeToPathArray(svgElement)
          : SVGPathCommander.parsePathString(svgElement.getAttribute("d"));
      if (!newElement) return;

      return { color: fill || classes[className], path: newElement };
    })
  );

  const shapes: ShapeProps[] = elements.map((element) => {
    return {
      color: element.color || "#000",
      area:
        (realArea / viewBoxArea) *
        Math.abs(SVGPathCommander.getPathArea(element.path)),
    };
  });

  const reduced = shapes.reduce((prev, shape) => {
    if (prev[shape.color]) {
      prev[shape.color] = prev[shape.color] + shape.area;
      return prev;
    }
    prev[shape.color] = shape.area;
    return prev;
  }, {} as Record<string, number>);

  console.log(reduced);

  const newShapes: ShapeProps[] = Object.entries(reduced)
    .map(([key, value]) => ({
      color: key,
      area: value,
    }))
    .sort((a, b) => b.area - a.area);

  return newShapes;
};
