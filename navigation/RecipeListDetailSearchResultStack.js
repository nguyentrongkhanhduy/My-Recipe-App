import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { RecipeListScreen } from "../screens/RecipeListScreen";
import { RecipeDetailScreen } from "../screens/RecipeDetailScreen";
import { RecipeSearchScreen } from "../screens/RecipeSearchScreen";
import { RecipeResultScreen } from "../screens/RecipeResultScreen";
import Colors from "../Constant";

const Stack = createNativeStackNavigator();

export const RecipeListDetaiSearchResultlStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="RecipeListScreen"
      screenOptions={{
        title: "",
        headerBackButtonDisplayMode: "minimal",
        headerTintColor: Colors.red,
        // headerTitleAlign: "center",
        contentStyle: {
          backgroundColor: "white",
        },
      }}
    >
      <Stack.Screen component={RecipeListScreen} name="RecipeListScreen" />
      <Stack.Screen component={RecipeDetailScreen} name="RecipeDetailScreen" />
      <Stack.Screen component={RecipeSearchScreen} name="RecipeSearchScreen" />
      <Stack.Screen component={RecipeResultScreen} name="RecipeResultScreen" />
    </Stack.Navigator>
  );
};
