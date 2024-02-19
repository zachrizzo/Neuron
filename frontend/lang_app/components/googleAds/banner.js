import { StyleSheet, Text, View } from "react-native";
import React from "react";

import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : "ca-app-pub-6223294263341364~1666169376";
const Banner = ({ isRelativePosition }) => {
  return (
    <View style={[styles.container]}>
      <Text style={styles.text}>To Remove ads, go Gold!</Text>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};

export default Banner;

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 30,
  },

  text: {
    color: "white",
    fontSize: 10,

    textAlign: "center",
    fontStyle: "italic",
    marginVertical: 10,
  },
});
