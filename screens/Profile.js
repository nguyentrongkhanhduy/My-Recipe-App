import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/FirebaseConfig";
import { SPOONACULAR_API_KEY } from "@env";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";
import Colors from "../Constant";

export const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [queryText, setQueryText] = useState("");
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = (screenWidth - 30) / 2;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        if (!user) return;
  
        const q = query(collection(db, "members"), where("email", "==", user.email));
        const snapshot = await getDocs(q);
        const userDoc = snapshot.docs[0];
  
        if (userDoc) {
          const userData = userDoc.data();
          console.log("✅ userData from Firestore:", userData);
          setDisplayName(userData.displayName);
          const favoriteIds = userData.favorites || [];
  
          const fetchedRecipes = await Promise.all(
            favoriteIds.map(async (id) => {
              try {
                const res = await axios.get(
                  `https://api.spoonacular.com/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}`
                );
                return res.data;
              } catch (err) {
                console.error("Failed to fetch recipe:", err);
                return null;
              }
            })
          );
  
          setSavedRecipes(fetchedRecipes.filter((r) => r !== null));
        }
      };
  
      fetchUserData();
    }, [user])
  );

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.emoji}>😍</Text>
        <Text style={styles.text}>
          Log in or create an account to save your favorite recipes
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("SignIn")}
        >
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const filteredRecipes = savedRecipes.filter((r) =>
    r.title.toLowerCase().includes(queryText.trim().toLowerCase())
  );

  return (
    <View
      style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top + 10 }}
    >
      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 16,
        }}
        contentContainerStyle={{
          paddingBottom: 30,
          backgroundColor: "#fff",
          paddingHorizontal: 10,
        }}
        ListHeaderComponent={
          <>
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => {
                  Alert.alert("Log Out", "Are you sure you want to log out?", [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Log Out",
                      style: "destructive",
                      onPress: () => {
                        auth
                          .signOut()
                          .catch((err) =>
                            console.error("Logout error:", err.message)
                          );
                      },
                    },
                  ]);
                }}
              >
                <Text style={styles.logoutButtonText}>Log Out</Text>
              </TouchableOpacity>

              <View style={styles.headerContent}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {displayName ? displayName[0] : "?"}
                  </Text>
                </View>
                <Text style={styles.name}>{displayName}</Text>
              </View>
            </View>

            <View style={styles.tabs}>
              <Text style={styles.activeTab}>Saved Recipes</Text>
            </View>

            <View style={{ position: "relative", margin: 15 }}>
              <TextInput
                style={styles.search}
                placeholder="Search Saved Recipes"
                value={queryText}
                onChangeText={setQueryText}
              />
              {queryText.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => setQueryText("")}
                >
                  <Text style={styles.clearButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("RecipeDetailScreen", { id: item.id })
            }
          >
            <View style={[styles.card, { width: cardWidth }]}>
              <Image
                source={{ uri: item.image }}
                style={{ width: "100%", height: 140, borderRadius: 8 }}
              />
              <Text style={styles.recipeText}>
                Ready in {item.readyInMinutes} mins • 👍 {item.aggregateLikes}
              </Text>
              <Text style={styles.recipeTitle} numberOfLines={2}>
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      {filteredRecipes.length === 0 && (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text style={{ color: "#888" }}>No recipes found.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  emoji: { fontSize: 100 },
  text: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 20,
    width: "80%",
  },
  button: {
    backgroundColor: Colors.red,
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  header: {
    backgroundColor: "#ADEBFF",
    borderRadius: 20,
    position: "relative",
  },
  headerContent: {
    alignItems: "center",
    paddingBottom: 20,
  },
  avatar: {
    backgroundColor: "#0077B6",
    borderRadius: 40,
    height: 80,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "600",
  },
  name: { fontSize: 22, fontWeight: "bold", color: "#000", marginTop: 8 },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  tab: {
    paddingBottom: 10,
    fontSize: 15,
    color: "#999",
  },
  activeTab: {
    fontSize: 15,
    fontWeight: "bold",
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderColor: Colors.red,
    color: Colors.red,
  },
  search: {
    margin: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    borderColor: "#ddd",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButton: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "#FF6B6B",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    zIndex: 10,
  },

  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  recipeText: { marginTop: 8, color: "#444", fontSize: 12 },
  recipeTitle: { fontWeight: "bold", marginTop: 5, fontSize: 14 },
  clearButton: {
    position: "absolute",
    right: 25,
    top: 25,
    backgroundColor: "#ccc",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 20,
  },
});
