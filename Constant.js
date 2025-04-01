const Colors = {
  teal: "#117f9d",
  lightBlue: "#7bdcef",
  red: "#e50753",
  lightGray: "#D3D3D3",
  darkGray: "#7f7f7f",
  lighterGray: "#ececec"
};

export default Colors;

export const cleanSummary = (html) => {
  let text = html.replace(/<b>/gi, "").replace(/<\/b>/gi, "");

  text = text.replace(/<(?!a\s|\/a)[^>]+>/gi, "");

  text = text.replace(/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, "$2");

  return text;
};
