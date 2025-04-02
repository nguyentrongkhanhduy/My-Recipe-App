import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { RecipeListDetaiSearchResultlStack } from "./RecipeListDetailSearchResultStack";
import { ProfileStack } from "./ProfileStack"; // <-- Import the new stack
import Colors from "../Constant";

const BottomTab = createBottomTabNavigator();

export const RecipeProfileTab = () => {
  return (
    <BottomTab.Navigator
      initialRouteName="RecipeListDetaiSearchResultlStack"
      screenOptions={{
        tabBarActiveTintColor: Colors.red,
        tabBarInactiveTintColor: Colors.darkGray,
      }}
    >
      <BottomTab.Screen
        component={RecipeListDetaiSearchResultlStack}
        name="RecipeListDetaiSearchResultlStack"
        options={{
          headerShown: false,
          tabBarLabel: "Discover",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        component={ProfileStack} // <-- Use the stack
        name="ProfileTab"
        options={{
          headerShown: false,
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};