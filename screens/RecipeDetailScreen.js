import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
  Share,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

import { SPOONACULAR_API_KEY } from "@env";

import Colors from "../Constant";
import { cleanSummary } from "../Constant";
import { RecipeCard } from "../components/RecipeCard";
import {
  doc,
  updateDoc,
  arrayUnion,
  getDocs,
  query,
  where,
  collection,
} from "firebase/firestore";
import { auth, db } from "../config/FirebaseConfig";
import { Alert } from "react-native";

export const RecipeDetailScreen = ({ navigation, route }) => {
  const { id } = route.params;

  const [recipeDetail, setRecipeDetail] = useState({});
  const [similarRecipes, setSimilarRecipes] = useState([]);

  const [summaryExpand, setSummaryExpand] = useState(false);
  const [nutritionExpand, setNutritionExpand] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showTitle, setShowTitle] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!auth.currentUser) return;

      const q = query(
        collection(db, "members"),
        where("email", "==", auth.currentUser.email)
      );
      const snapshot = await getDocs(q);
      const userDoc = snapshot.docs[0];

      if (userDoc) {
        const data = userDoc.data();
        const favorites = data.favorites || [];

        const isFav = favorites.some((recipe) => recipe.id === id);
        setIsFavorite(isFav);
      }
    };

    checkIfFavorite();
  }, [id]);

  //set nav bar buttons
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        const handleFavorite = async () => {
          try {
            if (!auth.currentUser) {
              Alert.alert(
                "Not logged in",
                "Please log in to save recipes to favorites.",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Log In",
                    onPress: () =>
                      navigation.navigate("ProfileTab", { screen: "SignIn" }),
                  },
                ]
              );
              return;
            }

            const q = query(
              collection(db, "members"),
              where("email", "==", auth.currentUser.email)
            );
            const snapshot = await getDocs(q);
            const userDoc = snapshot.docs[0];

            if (!userDoc) return;

            const userDocRef = doc(db, "members", userDoc.id);
            const data = userDoc.data();
            const currentFavorites = data.favorites || [];

            const isAlreadyFavorite = currentFavorites.some(
              (fav) => fav.id === recipeDetail.id
            );

            // If recipe isn't fully loaded, block it
            if (
              !recipeDetail.id ||
              !recipeDetail.title ||
              !recipeDetail.image
            ) {
              Alert.alert(
                "Recipe not ready",
                "Recipe details are not fully loaded yet."
              );
              return;
            }

            const minimalRecipe = {
              id: recipeDetail.id,
              title: recipeDetail.title,
              image: recipeDetail.image,
              readyInMinutes: recipeDetail.readyInMinutes,
              aggregateLikes: recipeDetail.aggregateLikes,
            };

            let updatedFavorites;

            if (isAlreadyFavorite) {
              updatedFavorites = currentFavorites.filter(
                (fav) => fav.id !== recipeDetail.id
              );
              setIsFavorite(false);
            } else {
              updatedFavorites = [...currentFavorites, minimalRecipe];
              setIsFavorite(true);
            }

            await updateDoc(userDocRef, { favorites: updatedFavorites });
          } catch (err) {
            Alert.alert("Failed", "Unable to update favorites");
            console.error("Favorite error:", err);
          }
        };

        const handleShare = async () => {
          try {
            if (!recipeDetail.title || !recipeDetail.sourceUrl) {
              Alert.alert("Recipe not ready to share.");
              return;
            }

            await Share.share({
              title: recipeDetail.title,
              message: `${recipeDetail.title}\nCheck out this recipe: ${recipeDetail.sourceUrl}`,
              url: recipeDetail.sourceUrl, // for iOS
            });
          } catch (error) {
            Alert.alert("Sharing failed", error.message);
            console.error("Share error:", error);
          }
        };

        return (
          <View style={styles.navBarButtonsContainer}>
            <TouchableOpacity onPress={handleShare}>
              <Ionicons
                name="share-social-outline"
                size={20}
                color={Colors.red}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFavorite}>
              <Ionicons
                name={isFavorite ? "bookmark" : "bookmark-outline"}
                size={20}
                color={Colors.red}
              />
            </TouchableOpacity>
          </View>
        );
      },
    });
  }, [navigation, isFavorite, recipeDetail]);

  //set title
  useEffect(() => {
    navigation.setOptions({
      title: showTitle ? recipeDetail.title : "",
      headerTitleStyle: showTitle
        ? {
            fontWeight: "bold",
            fontSize: 18,
            maxWidth: "70%",
            textAlign: "center",
            alignSelf: "center",
          }
        : {},
      headerTitleAlign: "center",
    });
  }, [showTitle, recipeDetail.title]);

  //get recipe by id
  useEffect(() => {
    axios
      .get(
        `https://api.spoonacular.com/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}&includeNutrition=true`
      )
      .then((response) => {
        setRecipeDetail(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("API Error:", error);
        setLoading(false);
      });
  }, []);

  //get similar recipe
  useEffect(() => {
    axios
      .get(
        `https://api.spoonacular.com/recipes/${id}/similar?apiKey=${SPOONACULAR_API_KEY}&number=7`
      )
      .then((response) => {
        setSimilarRecipes(response.data);
      })
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

  const renderStepRows = () => {
    let globalStep = 1;
    return recipeDetail.analyzedInstructions?.flatMap((instruction) =>
      instruction.steps.map((step, index) => (
        <StepRow
          key={`${step.step}-${globalStep}`}
          step={globalStep++}
          description={step.step}
        />
      ))
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      onScroll={(e) => {
        const offsetY = e.nativeEvent.contentOffset.y;
        setShowTitle(offsetY > 60);
      }}
      scrollEventThrottle={16}
    >
      {loading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
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

        <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>
          Related Recipes
        </Text>
        <FlatList
          data={similarRecipes}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <RecipeCard
              recipe={item}
              onPressRecipe={() => {
                navigation.push("RecipeDetailScreen", item);
              }}
            />
          )}
        />
      </View>

      <View style={styles.stepContainer}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Step by step</Text>

        {renderStepRows()}
      </View>
    </ScrollView>
  );
};

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.6)", // semi-transparent white
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
