import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SPOONACULAR_API_KEY } from "@env";
import axios from "axios";

import Colors from "../Constant";
import { RecipeGrid } from "../components/RecipeGrid";
import { NUMBER_OF_RESULT } from "../Constant";

export const RecipeListScreen = ({ navigation, route }) => {
  const [recipes, setRecipes] = useState([]);
  const [rndRecipe, setRndRecipe] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => {
        return (
          <TouchableOpacity
            style={styles.searchBarContainer}
            onPress={() => navigation.navigate("RecipeSearchScreen")}
          >
            <Ionicons
              name="search-outline"
              size={16}
              color={Colors.darkGray}
              style={{ position: "absolute", left: 12 }}
            />
            <Text style={styles.searchPlaceholderText}>Search for recipes</Text>
          </TouchableOpacity>
        );
      },
      headerTitleAlign: "center",
    });
  }, []);

  // get list recipe
  useEffect(() => {
    axios
      .get(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&number=${NUMBER_OF_RESULT}&addRecipeInformation=true`
      )
      .then((response) => {
        setRecipes(response.data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error("API Error:", error);
        setLoading(false);
      });
  }, []);

  // get 1 random Recipe
  useEffect(() => {
    axios
      .get(
        `https://api.spoonacular.com/recipes/random?apiKey=${SPOONACULAR_API_KEY}&number=1`
      )
      .then((response) => setRndRecipe(response.data.recipes[0]))
      .catch((error) => {
        console.error("API Error:", error);
      });
  }, []);

  const BigItem = ({ recipe, onPressRecipe }) => {
    return (
      <TouchableOpacity style={styles.bigItemContainer} onPress={onPressRecipe}>
        <Image source={{ uri: recipe.image }} style={styles.bigItemImage} />
        <Text style={styles.bigItemTime}>{recipe.readyInMinutes} mins</Text>
        <Text style={styles.bigItemTitle}>{recipe.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Loading recipes...</Text>
        </View>
      )}
      <FlatList
        data={recipes}
        keyExtractor={(recipe) => recipe.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={(recipe) => {
          return (
            <RecipeGrid
              recipe={recipe.item}
              onPressRecipe={() => {
                navigation.navigate("RecipeDetailScreen", recipe.item);
              }}
            />
          );
        }}
        numColumns={2}
        ListHeaderComponent={
          <View>
            <Text style={styles.sectionText}>What We're Loving Now</Text>
            <BigItem
              recipe={rndRecipe}
              onPressRecipe={() => {
                navigation.navigate("RecipeDetailScreen", rndRecipe);
              }}
            />
            <Text style={styles.sectionText}>Recent</Text>
          </View>
        }
      />
    </View>
  );
};

const screenWidth = Dimensions.get("window").width;
const itemSpacing = 24; // margin between items (adjust based on your gridItem margin)
const itemWidth = (screenWidth - itemSpacing * 3) / 2; // 2 columns

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  loadingText: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionText: {
    marginTop: 24,
    marginLeft: 24,
    alignSelf: "left",
    fontSize: 20,
    fontWeight: "bold",
  },

  searchBarContainer: {
    position: "relative",
    flexDirection: "row",
    width: "90%",
    justifyContent: "center",
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
  },

  bigItemContainer: {
    margin: 16,
    marginHorizontal: 16,
    marginTop: 12,
    width: screenWidth - 32,
    backgroundColor: Colors.lightBlue,
    borderRadius: 8,
    overflow: "hidden",
  },
  bigItemImage: {
    width: "100%",
    height: screenWidth - 32, // keep it square based on container width
  },
  bigItemTime: {
    marginTop: 12,
    marginLeft: 24,
  },
  bigItemTitle: {
    marginTop: 4,
    marginHorizontal: 24,
    marginBottom: 24,
    fontSize: 24,
    fontWeight: "bold",
  },

  gridItem: {
    margin: 16,
    width: itemWidth,
  },
  recipeImage: {
    borderRadius: 8,
    width: itemWidth,
    height: itemWidth,
  },
  recipeTitle: {
    width: itemWidth,
    marginTop: 8,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "left",
    flexWrap: "wrap",
  },
  recipeTime: {
    marginTop: 4,
  },
  captionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  captionText: {
    marginLeft: 4,
    fontSize: 12,
    color: Colors.teal,
  },
});
