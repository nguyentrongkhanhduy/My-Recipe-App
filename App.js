import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SPOONACULAR_API_KEY } from "@env";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Provider } from "react-redux";
import { store } from "./redux/store";

import { RecipeListDetaiSearchResultlStack } from "./navigation/RecipeListDetailSearchResultStack";
import { RecipeProfileTab } from "./navigation/RecipeProfileTab";

export default function App() {
  // console.log(SPOONACULAR_API_KEY); //API KEY
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <RecipeProfileTab />
          <StatusBar style="auto" />
        </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>
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
