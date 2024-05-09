import { StyleSheet } from "react-native";
import colors from "../colors";

const screenNumberStyles = StyleSheet.create({
  numberStyle: {
    fontSize: 10,
    position: "relative",
    fontWeight: "bold",
    bottom: -40,
    color: colors.primary,
  },
});

export default screenNumberStyles;
