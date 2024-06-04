import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import profilePhoto from "../../assets/profile/1.png";
import Feather from "react-native-vector-icons/Feather";
import { Badge } from "react-native-paper";
import SearchBarHome from "./SearchViewHome";

export default function ProfileAccount() {
  return (
    <View style={stylesProfile.container}>
      <View style={stylesProfile.boxProfile}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
            flexDirection: "row",
          }}
        >
          <Image
            source={profilePhoto}
            width={48}
            height={48}
            borderRadius={"50%"}
          />
          <View style={stylesProfile.titleName}>
            <Text style={{ fontSize: 16, textAlign: "left", color: "#364764" }}>
              Olá,
            </Text>
            <Text
              style={{
                fontSize: 22,
                textAlign: "left",
                color: "#172B4D",
                fontWeight: "bold",
              }}
            >
              Polina 🖐
            </Text>
          </View>
          <View style={stylesProfile.boxNotification}>
            <View style={stylesProfile.boxColor}>
              <Feather name="bell" color={"#172B4D"} size={15} />
              <Badge
                style={{ position: "absolute", top: 5, right: 5 }}
                size={15}
              >
                3
              </Badge>
            </View>
          </View>
        </View>
        <SearchBarHome />
      </View>
    </View>
  );
}

const stylesProfile = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "columm",
    alignItems: "center",
    justifyContent: "space-around",
    width: "85%",
    marginRight: "auto",
    marginLeft: "auto",
  },
  boxProfile: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  boxNotification: {
    height: 48,
    width: "100%",
    marginRight: "auto",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  boxColor: {
    backgroundColor: "#F1F5F6",
    width: 50,
    height: 50,
    borderRadius: 24,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  titleName: {
    marginLeft: 12,
  },
});
