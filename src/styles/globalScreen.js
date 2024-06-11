import { StyleSheet } from "react-native";
import colors from "../colors";

const styles = StyleSheet.create({
  chip: {
    margin: "3%",
    backgroundColor: colors.primary,
  },
  chipsContainer: {
    display: "flex",
    flexDirection: "row",
    padding: "5%",
  },
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    height: "auto",
    display: "flex",
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
    color: colors.primary,
  },
  linkPrivacy: {
    marginTop: 10,
  },
  containerFooter: {
    position: "relative",
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    height: "auto",
    alignItems: "center",
  },
  textFinalTextScreen: {
    position: "relative",
    textAlign: "center",
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
    position: "relative",
    flexDirection: "row",
    // backgroundColor: "red",
  },
});

export default styles;
