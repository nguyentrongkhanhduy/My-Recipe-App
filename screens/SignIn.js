import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/FirebaseConfig";
import Colors from "../Constant";

export const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.toLowerCase(), password);

      // 👇 Navigate to tab screen after login
      navigation.reset({
        index: 0,
        routes: [{ name: "ProfileTab" }],
      });
    } catch (error) {
      Alert.alert("Login Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        >
            <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      <Text style={styles.emoji}>😍</Text>
      <Text style={styles.title}>Log in to save your favorite recipes</Text>

      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>

      <View style={styles.signupPrompt}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.signupLink}> Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", flex: 1, alignItems: "center", paddingHorizontal: 30, justifyContent: "center" },
  emoji: { fontSize: 60 },
  title: { fontSize: 18, fontWeight: "600", textAlign: "center", marginVertical: 20, color: "#000" },
  input: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingVertical: 10, paddingHorizontal: 15, marginVertical: 8, fontSize: 16 },
  button: { backgroundColor: Colors.red, width: "100%", paddingVertical: 15, borderRadius: 8, marginVertical: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  agreement: { fontSize: 12, textAlign: "center", color: "#333", marginTop: 10 },
  link: { color: Colors.red, fontWeight: "500" },
  signupPrompt: { flexDirection: "row", marginTop: 20 },
  signupText: { fontSize: 14 },
  signupLink: { fontSize: 14, fontWeight: "600", color: Colors.red },
  backButton: {
    position: "absolute",
    top: 70,
    left: 20,
    zIndex: 10,
  },
  backText: {
    fontSize: 16,
    color: Colors.red,
    fontWeight: "600",
  },
});