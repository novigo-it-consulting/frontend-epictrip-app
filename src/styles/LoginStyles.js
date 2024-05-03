import { StyleSheet } from "react-native";
import colors from "../colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "75%",
    marginLeft: "auto",
    marginRight: "auto",
    paddingBottom: 40,
  },
  textTitle: {
    fontSize: 37,
    textAlign: "left",
    width: "100%",
    marginBottom: 20,
    fontWeight: "bold",
  },
  textEmail: {
    width: "100%",
    marginBottom: 20,
    borderColor: colors.primary,
    backgroundColor: "transparent",
  },
  textPassword: {
    width: "100%",
    marginBottom: 16,
    backgroundColor: "transparent",
    borderColor: colors.primary,
  },
  button: {
    width: "100%",
    marginTop: 16,
    padding: 8,
  },
  linkForgotPassword: {
    marginTop: 8,
    fontWeight: "bold",
  },
  link: {
    fontWeight: "bold",
  },
  containerText: {
    position: "absolute",
    bottom: 50,
  },
  imageLogo: {
    position: "absolute",
    top: 80,
    width: 200,
    height: 100,
  },
});

export default styles;
