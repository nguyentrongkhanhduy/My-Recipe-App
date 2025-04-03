const Colors = {
  teal: "#117f9d",
  lightBlue: "#7bdcef",
  red: "#e50753",
  lightGray: "#D3D3D3",
  darkGray: "#7f7f7f",
  lighterGray: "#ececec",
};

export default Colors;

export const cleanSummary = (html) => {
  let text = html.replace(/<b>/gi, "").replace(/<\/b>/gi, "");

  text = text.replace(/<(?!a\s|\/a)[^>]+>/gi, "");

  text = text.replace(/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, "$2");

  return text;
};

export const difficulties = [
  { label: "Under 15 Minutes", value: 15 },
  { label: "Under 30 Minutes", value: 30 },
  { label: "Under 45 Minutes", value: 45 },
  { label: "Under 1 Hour", value: 60 },
];

export const cuisines = [
  { label: "African", value: "african" },
  { label: "Asian", value: "asian" },
  { label: "American", value: "american" },
  { label: "British", value: "british" },
  { label: "Cajun", value: "cajun" },
  { label: "Caribbean", value: "caribbean" },
  { label: "Chinese", value: "chinese" },
  { label: "Eastern European", value: "eastern european" },
  { label: "European", value: "european" },
  { label: "French", value: "french" },
  { label: "German", value: "german" },
  { label: "Greek", value: "greek" },
  { label: "Indian", value: "indian" },
  { label: "Irish", value: "irish" },
  { label: "Italian", value: "italian" },
  { label: "Japanese", value: "japanese" },
  { label: "Jewish", value: "jewish" },
  { label: "Korean", value: "korean" },
  { label: "Latin American", value: "latin american" },
  { label: "Mediterranean", value: "mediterranean" },
  { label: "Mexican", value: "mexican" },
  { label: "Middle Eastern", value: "middle eastern" },
  { label: "Nordic", value: "nordic" },
  { label: "Southern", value: "southern" },
  { label: "Spanish", value: "spanish" },
  { label: "Thai", value: "thai" },
  { label: "Vietnamese", value: "vietnamese" },
];

export const meals = [
  { label: "Main Course", value: "main course" },
  { label: "Side Dish", value: "side dish" },
  { label: "Dessert", value: "dessert" },
  { label: "Appetizer", value: "appetizer" },
  { label: "Salad", value: "salad" },
  { label: "Bread", value: "bread" },
  { label: "Breakfast", value: "breakfast" },
  { label: "Soup", value: "soup" },
  { label: "Beverage", value: "beverage" },
  { label: "Sauce", value: "sauce" },
  { label: "Marinade", value: "marinade" },
  { label: "Fingerfood", value: "fingerfood" },
  { label: "Snack", value: "snack" },
  { label: "Drink", value: "drink" },
];

export const diets = [
  { label: "Gluten Free", value: "gluten free" },
  { label: "Ketogenic", value: "ketogenic" },
  { label: "Vegetarian", value: "vegetarian" },
  { label: "Lacto-Vegetarian", value: "lacto-vegetarian" },
  { label: "Ovo-Vegetarian", value: "ovo-vegetarian" },
  { label: "Vegan", value: "vegan" },
  { label: "Pescetarian", value: "pescetarian" },
  { label: "Paleo", value: "paleo" },
  { label: "Primal", value: "primal" },
  { label: "Low FODMAP", value: "low FODMAP" },
  { label: "Whole30", value: "whole30" },
];

export const intolerances = [
  { label: "Dairy", value: "dairy" },
  { label: "Egg", value: "egg" },
  { label: "Gluten", value: "gluten" },
  { label: "Grain", value: "grain" },
  { label: "Peanut", value: "peanut" },
  { label: "Seafood", value: "seafood" },
  { label: "Sesame", value: "sesame" },
  { label: "Shellfish", value: "shellfish" },
  { label: "Soy", value: "soy" },
  { label: "Sulfite", value: "sulfite" },
  { label: "Tree Nut", value: "tree nut" },
  { label: "Wheat", value: "wheat" },
];

export const NUMBER_OF_RESULT = "10";
