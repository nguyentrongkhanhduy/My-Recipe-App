import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../Constant";

export const RecipeSearchScreen = ({ navigation, route }) => {
  const [searchText, setSearchText] = useState("");
  const inputRef = useRef(null);

  const difficulties = [
    { label: "Under 15 Minutes", value: 15 },
    { label: "Under 30 Minutes", value: 30 },
    { label: "Under 45 Minutes", value: 45 },
    { label: "Under 1 Hour", value: 60 },
  ];

  const cuisines = [
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

  const meals = [
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

  const diets = [
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

  const intolerances = [
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

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => {
        return (
          <View
            style={styles.searchBarContainer}
            onPress={() => navigation.navigate("RecipeSearchScreen")}
          >
            <Ionicons name="search-outline" size={16} color={Colors.darkGray} />
            {/* <Text style={styles.searchPlaceholderText}>Search for recipes</Text> */}
            <TextInput
              ref={inputRef}
              style={styles.searchPlaceholderText}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        );
      },
    });
  }, [searchText]);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Popular</Text>
      <View style={styles.popularButtonRowContainer}>
        <TouchableOpacity style={styles.popularButtonContainer}>
          <Image
            source={require("../assets/images/dinner.png")}
            style={styles.popularButtonImage}
          />
          <Text style={styles.popularButtonText}>Dinner</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.popularButtonContainer}>
          <Image
            source={require("../assets/images/vegetable.png")}
            style={styles.popularButtonImage}
          />
          <Text style={styles.popularButtonText}>Vegan</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.popularButtonRowContainer, { marginTop: 8 }]}>
        <TouchableOpacity style={styles.popularButtonContainer}>
          <Image
            source={require("../assets/images/clock.png")}
            style={styles.popularButtonImage}
          />
          <Text style={styles.popularButtonText}>Under 30 Minutes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.popularButtonContainer}>
          <Image
            source={require("../assets/images/chicken-leg.png")}
            style={styles.popularButtonImage}
          />
          <Text style={styles.popularButtonText}>Chicken</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.popularButtonRowContainer, { marginTop: 8 }]}>
        <TouchableOpacity style={styles.popularButtonContainer}>
          <Image
            source={require("../assets/images/piggy-bank.png")}
            style={styles.popularButtonImage}
          />
          <Text style={styles.popularButtonText}>Affordable</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.popularButtonContainer}>
          <Image
            source={require("../assets/images/gelato.png")}
            style={styles.popularButtonImage}
          />
          <Text style={styles.popularButtonText}>Desserts</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Difficulty</Text>
      <View style={styles.filterButtonContainer}>
        {difficulties.map((item, index) => (
          <TouchableOpacity key={index} style={styles.filterButton}>
            <Text style={styles.filterText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Meal</Text>
      <View style={styles.filterButtonContainer}>
        {meals.map((item, index) => (
          <TouchableOpacity key={index} style={styles.filterButton}>
            <Text style={styles.filterText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Diet</Text>
      <View style={styles.filterButtonContainer}>
        {diets.map((item, index) => (
          <TouchableOpacity key={index} style={styles.filterButton}>
            <Text style={styles.filterText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Cuisine</Text>
      <View style={styles.filterButtonContainer}>
        {cuisines.map((item, index) => (
          <TouchableOpacity key={index} style={styles.filterButton}>
            <Text style={styles.filterText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Intolerance</Text>
      <View style={styles.filterButtonContainer}>
        {intolerances.map((item, index) => (
          <TouchableOpacity key={index} style={styles.filterButton}>
            <Text style={styles.filterText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ marginBottom: 30 }}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },

  searchBarContainer: {
    flexDirection: "row",
    width: "105%",
    justifyContent: "flex-start",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 20,
    borderColor: Colors.darkGray,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  searchPlaceholderText: {
    fontSize: 16,
    color: Colors.darkGray,
    marginLeft: 8,
    flexGrow: 1,
  },

  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
    marginTop: 32,
  },
  popularButtonRowContainer: {
    flexDirection: "row",
    gap: 8,
  },
  popularButtonContainer: {
    backgroundColor: Colors.lighterGray,
    flex: 1,
    padding: 16,
    borderRadius: 4,
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  popularButtonText: {
    color: Colors.red,
    fontWeight: "bold",
    fontSize: 15,
    flex: 1,
    flexWrap: "wrap",
  },
  popularButtonImage: {
    width: 20,
    height: 20,
  },

  filterButtonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterButton: {
    backgroundColor: Colors.red,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});
