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
import { useState, useEffect, useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import debounce from "lodash/debounce"; //avoid calling api rapidly

import { useDispatch, useSelector } from "react-redux";
import { addParam, deleteParam } from "../redux/actions";

import { SPOONACULAR_API_KEY } from "@env";

import Colors from "../Constant";
import {
  cuisines,
  diets,
  meals,
  difficulties,
  intolerances,
} from "../Constant";

export const RecipeSearchScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const paramList = useSelector((state) => state.params.listOfParams);

  const handleAddParam = useCallback(({ name, type, longName }) => {
    const newTask = {
      id: Date.now(),
      name: name,
      longName: longName,
      paramType: type,
    };

    dispatch(addParam(newTask));

    navigation.navigate("RecipeResultScreen");
  }, []);

  const inputRef = useRef(null);

  const [searchText, setSearchText] = useState("");
  const [autocompleteText, setAutocompleteText] = useState([]);

  const [showSearchResults, setShowSearchResults] = useState(false);

  //clear param list when navigating back
  useFocusEffect(
    useCallback(() => {
      return () => {
        paramList.forEach((param) => {
          dispatch(deleteParam(param.id));
        });
      };
    }, [paramList])
  );

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
              onChangeText={updateSearch}
              autoCapitalize="none"
              returnKeyType="search"
              onSubmitEditing={() => {
                handleAddParam({
                  name: searchText.trim(),
                  type: "query",
                  longName: searchText.trim(),
                });
                setShowSearchResults(false);
                setSearchText("");
              }}
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

  const updateSearch = (text) => {
    setSearchText(text);
    setShowSearchResults(text.trim().length > 0);
    getAutocompleteSearch(text);
  };

  //get search autocomplete text
  const getAutocompleteSearch = useCallback(
    debounce((text) => {
      axios
        .get(
          `https://api.spoonacular.com/recipes/autocomplete?apiKey=${SPOONACULAR_API_KEY}&number=5&query=${text}`
        )
        .then((response) => {
          setAutocompleteText(response.data);
        })
        .catch((error) => {
          console.error("API Error:", error);
        });
    }, 300),
    []
  );

  return (
    <View>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Popular</Text>
        <View style={styles.popularButtonRowContainer}>
          <TouchableOpacity
            style={styles.popularButtonContainer}
            onPress={() =>
              handleAddParam({ name: "snack", type: "type", longName: "Snack" })
            }
          >
            <Image
              source={require("../assets/images/nachos.png")}
              style={styles.popularButtonImage}
            />
            <Text style={styles.popularButtonText}>Snack</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.popularButtonContainer}
            onPress={() =>
              handleAddParam({ name: "vegan", type: "diet", longName: "Vegan" })
            }
          >
            <Image
              source={require("../assets/images/vegetable.png")}
              style={styles.popularButtonImage}
            />
            <Text style={styles.popularButtonText}>Vegan</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.popularButtonRowContainer, { marginTop: 8 }]}>
          <TouchableOpacity
            style={styles.popularButtonContainer}
            onPress={() =>
              handleAddParam({
                name: "30",
                type: "maxReadyTime",
                longName: "Under 30 Minutes",
              })
            }
          >
            <Image
              source={require("../assets/images/clock.png")}
              style={styles.popularButtonImage}
            />
            <Text style={styles.popularButtonText}>Under 30 Minutes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.popularButtonContainer}
            onPress={() =>
              handleAddParam({
                name: "chicken",
                type: "query",
                longName: "chicken",
              })
            }
          >
            <Image
              source={require("../assets/images/chicken-leg.png")}
              style={styles.popularButtonImage}
            />
            <Text style={styles.popularButtonText}>Chicken</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.popularButtonRowContainer, { marginTop: 8 }]}>
          <TouchableOpacity
            style={styles.popularButtonContainer}
            onPress={() =>
              handleAddParam({
                name: "drink",
                type: "type",
                longName: "Drinks",
              })
            }
          >
            <Image
              source={require("../assets/images/drink.png")}
              style={styles.popularButtonImage}
            />
            <Text style={styles.popularButtonText}>Drinks</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.popularButtonContainer}
            onPress={() =>
              handleAddParam({
                name: "dessert",
                type: "type",
                longName: "Desserts",
              })
            }
          >
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
            <TouchableOpacity
              key={index}
              style={styles.filterButton}
              onPress={() =>
                handleAddParam({
                  name: item.value,
                  type: "maxReadyTime",
                  longName: item.label,
                })
              }
            >
              <Text style={styles.filterText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Meal</Text>
        <View style={styles.filterButtonContainer}>
          {meals.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.filterButton}
              onPress={() =>
                handleAddParam({
                  name: item.value,
                  type: "type",
                  longName: item.label,
                })
              }
            >
              <Text style={styles.filterText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Diet</Text>
        <View style={styles.filterButtonContainer}>
          {diets.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.filterButton}
              onPress={() =>
                handleAddParam({
                  name: item.value,
                  type: "diet",
                  longName: item.label,
                })
              }
            >
              <Text style={styles.filterText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Cuisine</Text>
        <View style={styles.filterButtonContainer}>
          {cuisines.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.filterButton}
              onPress={() =>
                handleAddParam({
                  name: item.value,
                  type: "cuisine",
                  longName: item.label,
                })
              }
            >
              <Text style={styles.filterText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Intolerance</Text>
        <View style={styles.filterButtonContainer}>
          {intolerances.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.filterButton}
              onPress={() =>
                handleAddParam({
                  name: item.value,
                  type: "intolerances",
                  longName: `No ${item.label}`,
                })
              }
            >
              <Text style={styles.filterText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ marginBottom: 30 }}></View>
      </ScrollView>

      {showSearchResults && (
        <View style={styles.searchResultsOverlay}>
          <FlatList
            data={autocompleteText}
            keyExtractor={(item) => item.id?.toString() || item.title}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => {
                  handleAddParam({ name: item.title, type: "query" });
                  setShowSearchResults(false);
                  setSearchText("");
                }}
              >
                <Text style={styles.resultText}>{item.title}</Text>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
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

  searchResultsOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    zIndex: 100,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexGrow: 1,
    flex: 1,
  },
  resultItem: {
    paddingVertical: 12,
  },
  resultText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.red,
  },
});
