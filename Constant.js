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
  // Replace <b> and </b> with nothing but keep text
  let text = html.replace(/<b>/gi, "").replace(/<\/b>/gi, "");

  // Remove all other tags except <a>
  text = text.replace(/<(?!a\s|\/a)[^>]+>/gi, "");

  // Replace <a href="...">Text</a> with just the text
  text = text.replace(/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, "$2");

  return text;
};
