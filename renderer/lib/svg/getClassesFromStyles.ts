export const getClassesFromStyles = (svg: Document) => {
  const styles = Array.from(svg.getElementsByTagName("style"))
    .map((style) => style.innerHTML)
    .join("");
  const regex = /\.([\w-]+)\{fill:(#[\dA-Fa-f]{3,6});\}/g;

  const result = {};
  let match;
  while ((match = regex.exec(styles))) {
    result[match[1]] = match[2];
  }

  return result;
};
