import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../Constant";

export const RecipeCard = ({ recipe, onPressRecipe }) => {
  const Caption = () => {
    {
      if (recipe.readyInMinutes < 30) {
        return (
          <View style={styles.captionContainer}>
            <Ionicons name="alarm" size={14} color={Colors.teal} />
            <Text style={styles.captionText}>Under 30 min</Text>
          </View>
        );
      } else {
        return null;
      }
    }
  };

  return (
    <TouchableOpacity style={styles.gridItem} onPress={onPressRecipe}>
      <Image
        source={{ uri: `https://spoonacular.com/recipeImages/${recipe.image}` }}
        style={styles.recipeImage}
      />
      <Text style={styles.recipeTime}>{recipe.readyInMinutes} mins</Text>
      <Text style={styles.recipeTitle}>{recipe.title}</Text>
      <Caption />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gridItem: {
    margin: 16,
    width: 130,
  },
  recipeImage: {
    borderRadius: 8,
    width: 130,
    height: 130,
  },
  recipeTitle: {
    width: 130,
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
