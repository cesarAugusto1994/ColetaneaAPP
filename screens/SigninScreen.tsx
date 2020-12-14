import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Card, Button, Input } from "react-native-elements";
import api from "../services/api/axios";
import onSingin from "../services/services/auth";

export default function NotFoundScreen() {
  const [username, setUsername] = React.useState(null);
  const [password, setPassword] = React.useState(null);

  // const verifyCreateLogin = async () => {
  //   try {
  //     const response = await api.post("register", { email: username, username, password }, {
  //       data: { email: username, username, password },
  //       headers: {
  //         "Content-Type": "application/json"
  //       }
  //     });
  //     if (response) {
  //       console.log('response', response.data);
  //       if(response.data.error) {
  //         alert(response.data.message)
  //       } else {
  //         verifyLogin()
  //         alert("Registrado Com Sucesso")
  //       }
  //     }
  //   } catch (error) {
  //     alert(error.data.message)
  //     console.log("error", error.data);
  //   }
  // };

  const verifyLogin = async () => {
    try {
      const response = await api.post("auth", { email: username, password }, {
        data: { email: username, password },
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response) {
        console.log('response', response.data);
        if(response.data.error) {
          alert(response.data.message)
        } else {
          
          alert("Registrado Com Sucesso")
        }
      }
    } catch (error) {
      alert(error.data.message)
      console.log("error", error.data);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha Coletânea</Text>

      <Card containerStyle={{ width: "100%" }}>
        <Input
          placeholder="Digite seu e-mail"
          leftIcon={{ type: "font-awesome", name: "user" }}
          onChangeText={text => setUsername(text)}
        />
        <Input
          secureTextEntry
          placeholder="Digite sua senha"
          leftIcon={{ type: "font-awesome", name: "key" }}
          onChangeText={text => setPassword(text)}
        />

        <Button
          buttonStyle={{ marginTop: 20 }}
          backgroundColor="#03A9F4"
          title="Entrar"
          onPress={() => {
            verifyLogin();
            // onSignIn().then(() => navigation.navigate("SignedIn"));
          }}
        />
      </Card>

      {/* <TextInput
        placeholder="E-mail"
        style={{
          width: "100%",
          backgroundColor: "#f5f5f5",
          padding: 10,
          marginVertical: 15
        }}
      />
      <TextInput
        placeholder="Senha"
        style={{ width: "100%", backgroundColor: "#f5f5f5", padding: 10 }}
        secureTextEntry={true}
      />
      <TouchableOpacity onPress={verifyLogin} style={styles.link}>
        <Text style={styles.linkText}>Logar</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d44b42",
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 20
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    backgroundColor: "#FFF",
    alignItems: "center",
    width: "100%"
  },
  linkText: {
    fontSize: 15,
    color: "#d44b42"
  }
});
