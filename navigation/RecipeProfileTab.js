import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { RecipeListDetaiSearchResultlStack } from "./RecipeListDetailSearchResultStack";
import { Profile } from "../screens/Profile";
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
        component={Profile}
        name="Profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};
