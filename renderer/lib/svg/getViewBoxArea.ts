export const getViewBox = (svgText: string) => {
  const parser = new DOMParser();
  const svg = parser.parseFromString(svgText, "image/svg+xml");

  const viewBox = svg
    .getElementsByTagName("svg")[0]
    .getAttribute("viewBox")
    .split(" "); // [ box.x, box.y, box.width, box.height ]
  const viewBoxX = viewBox[2];
  const viewBoxY = viewBox[3];

  return [Number(viewBoxX), Number(viewBoxY)];
};

export const getViewBoxRatio = (viewBox: number[]) => {
  const ratio = viewBox[0] / viewBox[1];

  return ratio;
};

export const getViewBoxArea = (svgText: string) => {
  const viewBox = getViewBox(svgText);

  const viewBoxArea = Math.abs(viewBox[0] * viewBox[1]);

  return viewBoxArea;
};
