import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

import { SPOONACULAR_API_KEY } from "@env";

import Colors from "../Constant";
import { cleanSummary } from "../Constant";

export const RecipeDetailScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const [recipeDetail, setRecipeDetail] = useState({});
  const [summaryExpand, setSummaryExpand] = useState(false);
  const [nutritionExpand, setNutritionExpand] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <View style={styles.navBarButtonsContainer}>
            <TouchableOpacity>
              <Ionicons
                name="share-social-outline"
                size={20}
                color={Colors.red}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="bookmark-outline" size={20} color={Colors.red} />
            </TouchableOpacity>
          </View>
        );
      },
    });
  }, []);

  //get recipe by id
  useEffect(() => {
    axios
      .get(
        `https://api.spoonacular.com/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}&includeNutrition=true`
      )
      .then((response) => setRecipeDetail(response.data))
      .catch((error) => {
        console.error("API Error:", error);
      });
  }, []);

  const IngredientRow = ({ name, amount, unit }) => {
    return (
      <View style={styles.ingredientRow}>
        <Text>{name}</Text>
        <Text style={{ fontWeight: "bold" }}>
          {amount} {unit}
        </Text>
      </View>
    );
  };

  const StepRow = ({ step, description }) => {
    return (
      <View style={styles.stepRow}>
        <Text style={{ fontWeight: "bold" }}>{step}</Text>
        <Text style={{ flex: 1 }}>{description}</Text>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ padding: 16 }}>
        <Text style={styles.title}>{recipeDetail.title}</Text>
        <TouchableOpacity
          onPress={() => {
            setSummaryExpand((prev) => !prev);
          }}
        >
          <Text
            style={styles.summary}
            numberOfLines={summaryExpand ? undefined : 3}
          >
            {cleanSummary(recipeDetail.summary || "")}
          </Text>
          <Ionicons
            name={summaryExpand ? "chevron-up-outline" : "chevron-down-outline"}
            color={Colors.red}
            size={20}
            style={styles.expandButton}
          />
        </TouchableOpacity>
        <View style={styles.timeContainer}>
          <Ionicons name="timer-outline" color={"black"} size={20} />
          <Text>
            Ready in{" "}
            <Text style={styles.timeText}>
              {recipeDetail.readyInMinutes} minutes
            </Text>
          </Text>
        </View>
      </View>

      <Image source={{ uri: recipeDetail.image }} style={styles.image} />
      <View style={{ padding: 16 }}>
        <View style={styles.ingredientTitle}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Ingredients for
          </Text>
          <Text style={{ fontSize: 18 }}>
            {recipeDetail.servings > 1
              ? `${recipeDetail.servings} servings`
              : `${recipeDetail.servings} serving`}
          </Text>
        </View>

        {recipeDetail.extendedIngredients?.map((ingredient, index) => {
          return (
            <IngredientRow
              key={`${ingredient.name}-${index}`}
              name={ingredient.nameClean}
              amount={ingredient.amount}
              unit={ingredient.measures.us.unitShort}
            />
          );
        })}

        <View style={[styles.ingredientTitle, { marginTop: 10 }]}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Nutrition info
          </Text>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            onPress={() => setNutritionExpand((prev) => !prev)}
          >
            <Text
              style={{ fontSize: 16, color: Colors.red, fontWeight: "bold" }}
            >
              {nutritionExpand ? "Hide Info" : "View Info"}
            </Text>
            <Ionicons
              name={nutritionExpand ? "remove-outline" : "add-outline"}
              color={Colors.red}
              size={16}
            />
          </TouchableOpacity>
        </View>

        {nutritionExpand && recipeDetail.nutrition?.nutrients?.length > 0 && (
          <TouchableOpacity onPress={() => setNutritionExpand((prev) => !prev)}>
            {recipeDetail.nutrition.nutrients.map((item, index) => (
              <IngredientRow
                key={`${item.name}-${index}`}
                name={item.name}
                amount={item.amount}
                unit={item.unit}
              />
            ))}
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.stepContainer}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Step by step</Text>

        {recipeDetail.analyzedInstructions?.[0]?.steps?.map((step, index) => {
          return (
            <StepRow
              key={`${step.step} - ${index}`}
              step={step.number}
              description={step.step}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
  },
  navBarButtonsContainer: {
    flexDirection: "row",
    gap: 18,
  },
  title: {
    fontSize: 28,
    textAlign: "left",
    fontWeight: "bold",
  },
  summary: {
    marginTop: 4,
    color: Colors.darkGray,
  },
  expandButton: {
    alignSelf: "flex-end",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    fontWeight: "bold",
  },
  image: {
    width: screenWidth,
    height: 350,
  },
  ingredientTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  ingredientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: Colors.lightGray,
    borderBottomWidth: 1,
    marginBottom: 8,
    paddingBottom: 8,
  },
  stepContainer: {
    backgroundColor: Colors.lighterGray,
    padding: 16,
  },
  stepRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "white",
    marginTop: 16,
    padding: 16,
    gap: 8,
    borderRadius: 4,
  },
});
