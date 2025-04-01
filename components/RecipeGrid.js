import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../Constant";

export const RecipeGrid = ({ recipe, onPressRecipe }) => {
  const Caption = () => {
    {
      if (recipe.cheap) {
        return (
          <View style={styles.captionContainer}>
            <Ionicons name="pricetag" size={14} color={Colors.teal} />
            <Text style={styles.captionText}>Affordable</Text>
          </View>
        );
      } else if (recipe.veryPopular) {
        return (
          <View style={styles.captionContainer}>
            <Ionicons name="flame" size={14} color={Colors.teal} />
            <Text style={styles.captionText}>Popular</Text>
          </View>
        );
      } else if (recipe.readyInMinutes < 30) {
        return (
          <View style={styles.captionContainer}>
            <Ionicons name="alarm" size={14} color={Colors.teal} />
            <Text style={styles.captionText}>Under 30 min</Text>
          </View>
        );
      } else if (recipe.veryHealthy) {
        return (
          <View style={styles.captionContainer}>
            <Ionicons name="heart" size={14} color={Colors.teal} />
            <Text style={styles.captionText}>Healthy</Text>
          </View>
        );
      } else {
        return null;
      }
    }
  };

  return (
    <TouchableOpacity style={styles.gridItem} onPress={onPressRecipe}>
      <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
      <Text style={styles.recipeTime}>
        {recipe.readyInMinutes >= 60
          ? `${Math.floor(recipe.readyInMinutes / 60)} h ${
              recipe.readyInMinutes % 60
            } mins`
          : `${recipe.readyInMinutes} mins`}
      </Text>
      <Text style={styles.recipeTitle}>{recipe.title}</Text>
      <Caption />
    </TouchableOpacity>
  );
};

const screenWidth = Dimensions.get("window").width;
const itemSpacing = 24; // margin between items (adjust based on your gridItem margin)
const itemWidth = (screenWidth - itemSpacing * 3) / 2; // 2 columns

const styles = StyleSheet.create({
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
