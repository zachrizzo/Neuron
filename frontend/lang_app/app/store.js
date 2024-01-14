import { StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { colorsDark } from "../utility/color";
import RoundButton from "../components/buttons/roundButtons";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import CortexCoins from "../components/gamification/cortexCredits";
// import {
//   BannerAd,
//   BannerAdSize,
//   TestIds,
// } from "react-native-google-mobile-ads";
// const adUnitId = __DEV__
//   ? TestIds.ADAPTIVE_BANNER
//   : "ca-app-pub-6223294263341364~1666169376";

const Store = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => {
            return (
              <RoundButton
                color={"#FFFFFF00"}
                icon={
                  <Ionicons
                    name="arrow-down"
                    size={24}
                    color={colorsDark.white}
                  />
                }
                onPress={() => {
                  router.push("/home");
                }}
              />
            );
          },
        }}
      />
      <View>
        <View
          style={{
            position: "absolute",
            top: -20,
            left: 60,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CortexCoins showAmount={false} size="200" isGold={true} />
        </View>
        <CortexCoins showAmount={false} size="200" />
      </View>
      <View>
        <Text style={styles.text}>regular store component</Text>
        <Text style={styles.text}>Buy Hearts</Text>
        <Text style={styles.text}>Buying Messages</Text>
        <Text style={styles.text}>Buying coins</Text>
        <Text style={styles.text}>Buying </Text>
        {/* <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        /> */}
      </View>
    </View>
  );
};

export default Store;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colorsDark.mainBackground,
    flex: 1,
  },
  ratingButtonView: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  text: {
    color: colorsDark.white,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
