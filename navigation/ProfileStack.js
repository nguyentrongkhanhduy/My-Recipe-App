// /navigation/ProfileStack.js
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Profile } from "../screens/Profile";
import { SignIn } from "../screens/SignIn";
import { SignUp } from "../screens/SignUp";
import {RecipeDetailScreen} from "../screens/RecipeDetailScreen"

const Stack = createNativeStackNavigator();

export const ProfileStack = () => {
  return (
    <Stack.Navigator initialRouteName="Profile" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen
  name="RecipeDetailScreen"
  component={RecipeDetailScreen}
/>
    </Stack.Navigator>
  );
};