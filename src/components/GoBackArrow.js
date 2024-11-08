import AntDesign from '@expo/vector-icons/AntDesign';
import {
    StyleSheet,
    View,
    TouchableOpacity
} from "react-native";
import { useNavigation } from '@react-navigation/native';

const GoBackArrow = ({ colorArrow }) => {
    const navigation = useNavigation();

    const goBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            console.warn("Não é possível voltar, pois não há tela anterior.");
        }
    };

    return (
        <View style={styles.containerBackButton}>
            <TouchableOpacity style={styles.touchableArrow} onPress={() => (goBack())}>
                <AntDesign name="arrowleft" size={40} color={colorArrow === null ? '#364764' : colorArrow} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    containerBackButton: {
        justifyContent: "space-around",
        alignItems: "flex-start",
        flexDirection: "column",
        flex: 0.1,
    },
    touchableArrow: {
        width: 100
    }
});

export default GoBackArrow;