import AntDesign from "@expo/vector-icons/AntDesign";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const GoBackArrow = ({ colorArrow }) => {
    const navigation = useNavigation();

    const goBack = () => {
        console.log("PORRA");
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            console.warn("Não é possível voltar, pois não há tela anterior.");
        }
    };

    return (
        <View style={styles.containerBackButton}>
            <TouchableOpacity
                style={styles.touchableArrow}
                onPress={() => {
                    console.log("Botão pressionado");
                    goBack();
                }}
            >
                <AntDesign name="arrowleft" size={32} color={colorArrow || "#364764"} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    containerBackButton: {
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 10,
    },
    touchableArrow: {
        width: 50,
    },
});

export default GoBackArrow;
