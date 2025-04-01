import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SPOONACULAR_API_KEY } from "@env";
import { NavigationContainer } from "@react-navigation/native";

import { RecipeListDetaiSearchResultlStack } from "./navigation/RecipeListDetailSearchResultStack";
import { RecipeProfileTab } from "./navigation/RecipeProfileTab";

export default function App() {
  // console.log(SPOONACULAR_API_KEY); //API KEY
  return (
    <NavigationContainer>
      <RecipeProfileTab />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
