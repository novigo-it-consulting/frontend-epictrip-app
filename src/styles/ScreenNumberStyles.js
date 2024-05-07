import { StyleSheet } from "react-native";
import colors from "../colors";

const screenNumberStyles = StyleSheet.create({
    numberStyle: {
        fontSize: 10,
        position: "absolute",
        fontWeight: "bold",
        bottom: 30,
        color: colors.primary,
    }
});

export default screenNumberStyles;