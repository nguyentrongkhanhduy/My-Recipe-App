// /navigation/ProfileStack.js
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Profile } from "../screens/Profile";
import { SignIn } from "../screens/SignIn";
import { SignUp } from "../screens/SignUp";
import { RecipeDetailScreen } from "../screens/RecipeDetailScreen";

import Colors from "../Constant";

const Stack = createNativeStackNavigator();

export const ProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
        headerTintColor: Colors.red,
      }}
    >
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerTitle: "" }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerTitle: "" }}
      />
      <Stack.Screen name="RecipeDetailScreen" component={RecipeDetailScreen} />
    </Stack.Navigator>
  );
};
