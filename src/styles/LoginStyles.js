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
  containerFields: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    height: "75%",
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
    position: "relative",
    bottom: -30,
  },
  containerText: {
    position: "relative",
    bottom: 0,
  },
  textFinalTextScreen: {
    position: "relative",
    bottom: -30,
  },
  imageLogo: {
    position: "relative",
    top: 0,
  },
  containerBackButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
});

export default styles;
