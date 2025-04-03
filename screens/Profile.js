import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Dimensions,
} from "react-native";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/FirebaseConfig";
import {
  useSafeAreaInsets,
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import Colors from "../Constant";
import { RecipeGrid } from "../components/RecipeGrid";

export const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [queryText, setQueryText] = useState("");
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = (screenWidth - 30) / 2;

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "members"), where("email", "==", user.email));
    const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
      const userDoc = snapshot.docs[0];
      if (userDoc) {
        const userData = userDoc.data();
        setDisplayName(userData.displayName);
        const favoriteRecipes = userData.favorites || [];
        setSavedRecipes(favoriteRecipes);
      }
    });

    return unsubscribeSnapshot;
  }, [user]);

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

  const filteredRecipes = savedRecipes.filter(
    (r) => r.title && r.title.toLowerCase().includes(queryText.trim().toLowerCase())
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
          }}
          contentContainerStyle={{
            paddingBottom: 30,
            backgroundColor: "#fff",
            paddingHorizontal: 10,
          }}
          showsVerticalScrollIndicator={false}
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
            <RecipeGrid
              recipe={item}
              onPressRecipe={() =>
                navigation.navigate("RecipeDetailScreen", { id: item.id })
              }
            />
          )}
        />
        {filteredRecipes.length === 0 && (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text style={{ color: "#888" }}>No recipes found.</Text>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
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
