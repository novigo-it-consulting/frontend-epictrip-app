import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const translate = async (q, source) => {
    try {
        const target = await AsyncStorage.getItem("language")
        const headers = {
            "content-Type": "application/json"
        }
        const data = {
            q: `${q}`,
            source: `${source}`,
            target: `${target}`
        }
        const response = await axios.post("https://translate.fertech.dev.br/translate", data, { headers })

        if (response.status === 200) {
            return response.data.translatedText;
        }
        return q;
    } catch {
        return q;
    }

};