import { StyleSheet, Text, View, Dimensions, FlatList } from "react-native";
import React, { useState } from "react";
import { Stack } from "expo-router";
import { colorsDark } from "../utility/color";
import RoundButton from "../components/buttons/roundButtons";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import CortexCoins from "../components/gamification/cortexCredits";
import StoreItem from "../components/store/storeItem";
import LifeIndicator from "../components/gamification/lifeIndicator";
import { useSelector } from "react-redux";
import { selectSubscriptionPackages } from "../redux/slices/userSlice";
import { useRevenueCat } from "../providers/revenueCatProvider";

// import {
//   BannerAd,
//   BannerAdSize,
//   TestIds,
// } from "react-native-google-mobile-ads";
// const adUnitId = __DEV__
//   ? TestIds.ADAPTIVE_BANNER
//   : "ca-app-pub-6223294263341364~1666169376";

const data = [
  {
    name: "5 Hearts",
    price: 0.99,
    icon: <Ionicons name="heart" size={34} color={colorsDark.red} />,
  },
  {
    name: "20 AI Messages",
    price: 2.99,
    icon: (
      <Ionicons name="chatbox-ellipses" size={34} color={colorsDark.purple} />
    ),
  },
  {
    name: " 100 Coins",
    price: 2.99,
    icon: <CortexCoins showAmount={false} size="60" isGold={false} />,
  },
  {
    name: "2 Streak Freeze",
    price: 1.99,
    icon: <Ionicons name="snow" size={34} color={colorsDark.brightBlue} />,
  },
];

const Store = () => {
  const subscriptionPackages = useSelector(selectSubscriptionPackages);
  const { user, packages, purchasePackage, restorePermissions } =
    useRevenueCat();
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const getIconName = (product) => {
    if (product.includes("Heart")) {
      return "heartsLocker";
    }
    if (product.includes("Message")) {
      return "aiMessages";
    }
    if (product.includes("Coins")) {
      return "treasureChest";
    }
    if (product.includes("Streak")) {
      return "streakFreeze";
    }
  };

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
      <FlatList
        data={[1]}
        style={{ flex: 1, flexDirection: "column" }}
        renderItem={({ item }) => {
          return (
            <View style={styles.container}>
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

              <View style={styles.storeContainer}>
                <FlatList
                  data={subscriptionPackages}
                  renderItem={({ item, index }) => {
                    if (item?.product?.productCategory != "SUBSCRIPTION") {
                      return (
                        <StoreItem
                          name={item?.identifier}
                          price={item?.product?.price.toFixed(2)}
                          icon={getIconName(item?.identifier)}
                          loading={selectedIndex === index && loading}
                          buttonOnPress={() => {
                            setLoading(true);
                            setSelectedIndex(index);
                            purchasePackage(item)
                              .then(() => {
                                setLoading(false);
                              })
                              .catch((e) => {
                                console.log(e);
                                setLoading(false);
                              });
                          }}
                        />
                      );
                    }
                  }}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={2}
                  columnWrapperStyle={{ justifyContent: "space-around" }}
                />
              </View>
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-around" }}
      />
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
  storeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});
