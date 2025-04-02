import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useState, useEffect, useRef, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import debounce from "lodash/debounce"; //avoid calling api rapidly
import { Modalize } from "react-native-modalize";

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
import { RecipeGrid } from "../components/RecipeGrid";

export const RecipeResultScreen = ({ navigation, route }) => {
  const paramList = useSelector((state) => state.params.listOfParams);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [autocompleteText, setAutocompleteText] = useState([]);
  const modalizeRef = useRef(null);
  const dispatch = useDispatch();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAddParam = useCallback(({ name, type, longName }) => {
    const newTask = {
      id: Date.now(),
      name: name,
      longName: longName,
      paramType: type,
    };

    dispatch(addParam(newTask));

    modalizeRef.current?.close();
  }, []);

  const handleDeleteParam = useCallback((id) => {
    dispatch(deleteParam(id));
  }, []);

  const flattenParams = useCallback(() => {
    return paramList
      .map(
        (param) =>
          `${encodeURIComponent(param.paramType)}=${encodeURIComponent(
            param.name
          )}`
      )
      .join("&");
  }, [paramList]);

  //set search text
  useFocusEffect(
    useCallback(() => {
      const queryParam = paramList.find((param) => param.paramType === "query");
      if (queryParam) {
        setSearchText(queryParam.name);
      } else {
        setSearchText("");
      }
    }, [paramList])
  );

  const updateSearch = (text) => {
    setSearchText(text);
    setShowSearchResults(text.trim().length > 0);

    if (text.length === 0) {
      const queryParam = paramList.find((param) => param.paramType === "query");
      if (queryParam) {
        dispatch(deleteParam(queryParam.id));
      }
    } else {
      getAutocompleteSearch(text);
    }
  };

  //navigate back if paramList empty
  useEffect(() => {
    if (paramList.length === 0) {
      navigation.goBack();
    }
  }, [paramList]);

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
              style={styles.searchPlaceholderText}
              value={searchText}
              onChangeText={updateSearch}
              autoCapitalize="none"
              returnKeyType="search"
              onSubmitEditing={() => {
                if (searchText.trim() === "") {
                  const queryParam = paramList.find(
                    (param) => param.paramType === "query"
                  );
                  if (queryParam) {
                    dispatch(deleteParam(queryParam.id));
                  }
                } else {
                  handleAddParam({
                    name: searchText.trim(),
                    type: "query",
                    longName: searchText.trim(),
                  });
                }
                setShowSearchResults(false);
              }}
            />
          </View>
        );
      },
    });
  }, [searchText]);

  //set nav bar button
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity onPress={() => modalizeRef.current?.open()}>
            <Ionicons name="options-outline" size={20} color={Colors.red} />
          </TouchableOpacity>
        );
      },
    });
  }, []);

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

  //get list recipe
  useEffect(() => {
    axios
      .get(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&number=5&addRecipeInformation=true&${flattenParams()}`
      )
      .then((response) => {
        setRecipes(response.data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error("API Error:", error);
        setLoading(false);
      });
  }, [paramList, flattenParams]);

  const checkParamList =
    paramList.length === 0 ||
    (paramList.length === 1 && paramList[0].paramType === "query");

  return (
    <>
      {!checkParamList && (
        <View>
          <ScrollView
            horizontal={true}
            contentContainerStyle={{ gap: 8, padding: 16 }}
            showsHorizontalScrollIndicator={false}
          >
            {paramList
              .filter((item) => item.paramType !== "query")
              .map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.filterButton,
                    {
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 4,
                    },
                  ]}
                  onPress={() => handleDeleteParam(item.id)}
                >
                  <Text style={styles.filterText}>{item.longName}</Text>
                  <Ionicons name="close-circle" size={14} color={"white"} />
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      )}
      <View>
        {loading && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>Loading recipes...</Text>
          </View>
        )}

        <FlatList
          data={recipes}
          keyExtractor={(recipe) => recipe.id.toString()}
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
        />
      </View>

      <Modalize
        ref={modalizeRef}
        modalHeight={Dimensions.get("window").height * 0.5} // Step 4: Render the Modalize component
        withHandle={false}
        adjustToContentHeight={false}
        panGestureEnabled={false}
        closeOnOverlayTap={true}
        HeaderComponent={
          <View style={styles.filterHeader}>
            <View style={{ flex: 1 }}></View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                flex: 1,
                textAlign: "center",
              }}
            >
              Add a Filter
            </Text>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => modalizeRef.current?.close()}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: Colors.red,
                  textAlign: "right",
                }}
              >
                Done
              </Text>
            </TouchableOpacity>
          </View>
        }
        scrollViewProps={{
          contentContainerStyle: { paddingHorizontal: 16 },
          showsVerticalScrollIndicator: true,
          keyboardShouldPersistTaps: "handled",
          bounces: false,
        }}
      >
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
      </Modalize>

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
    </>
  );
};

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
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },

  searchBarContainer: {
    flexDirection: "row",
    width: "100%",
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

  filterHeader: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: Colors.lighterGray,
  },
});
