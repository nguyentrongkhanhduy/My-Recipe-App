import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../config/FirebaseConfig";
import Colors from "../Constant";

export const SignUp = ({ navigation }) => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await addDoc(collection(db, "members"), {
        displayName,
        email: user.email.toLowerCase(),
        favorites: [],
      });

      navigation.replace("Profile");
    } catch (error) {
      Alert.alert("Sign Up Error", error.message);
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
      <Text style={styles.title}>Create an account to save your favorite recipes</Text>

      <TextInput style={styles.input} placeholder="Display Name" value={displayName} onChangeText={setDisplayName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>

      <Text style={styles.agreement}>
        By signing up, you agree to our <Text style={styles.link}>User Agreement</Text> and <Text style={styles.link}>Privacy Policy</Text>.
      </Text>
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