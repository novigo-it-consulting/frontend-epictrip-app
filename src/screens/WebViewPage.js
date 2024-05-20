import { WebView } from "react-native-webview";
import { StyleSheet } from "react-native";

export default function App() {
  return (
    <WebView
      style={styles.container}
      source={{ uri: "https://qa.myepictrip.app/legal" }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
