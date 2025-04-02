import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { auth } from "../config/FirebaseConfig";
import Colors from "../Constant";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export const Settings = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        navigation.goBack(); // go back to Profile
      })
      .catch((err) => {
        Alert.alert("Logout Error", err.message);
      });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top}]}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color="black" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Settings</Text>

      <TouchableOpacity style={styles.option} onPress={() => {}}>
        <Text style={styles.optionText}>Change Avatar (coming soon)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.option, { backgroundColor: Colors.red }]} onPress={handleLogout}>
        <Text style={[styles.optionText, { color: "#fff" }]}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    marginLeft: 5,
    color: "#000",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  option: {
    padding: 15,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    marginBottom: 15,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
  },
});