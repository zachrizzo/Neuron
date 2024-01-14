import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { colorsDark } from "../utility/color";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSubscriptionPackages,
  setSubscriptionPackages,
} from "../redux/slices/userSlice";
import MainButton from "../components/buttons/mainButton";
import DividerLine from "../components/layout/dividerLine";
import { useRevenueCat } from "../providers/revenueCatProvider";
import { Stack } from "expo-router";
import { getAllProducts } from "../firebase/packages/packages";

const Subscriptions = () => {
  const subscriptionPackages = useSelector(selectSubscriptionPackages);
  const { user, packages, purchasePackage, restorePermissions } =
    useRevenueCat();

  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [details, setDetails] = useState(null);
  //   const dispatch = useDispatch();

  console.log(user.subscriptionStatus);

  useEffect(() => {
    getAllProducts(setDetails);
  }, []);

  const allDetails = (tier) => {
    return details?.map((item) => {
      if (item?.id === tier) {
        return item?.details.map((item2) => {
          return <Text style={styles.detailsText}>{item2}</Text>;
        });
      }
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Subscriptions",
        }}
      />
      <FlatList
        data={subscriptionPackages}
        renderItem={({ item, index }) => {
          console.log(item);
          if (item.product.productCategory === "SUBSCRIPTION") {
            return (
              <View style={styles.purchaseItem}>
                <Text
                  style={[
                    styles.headerText,
                    {
                      color: item?.identifier.includes("Gold")
                        ? "#FFE602"
                        : item?.identifier.includes("Hearts")
                        ? "#FF0000"
                        : colorsDark.purple,
                    },
                  ]}
                >
                  d{item.identifier}
                </Text>
                <DividerLine marginTop={20} />
                <Text style={styles.subSubscriptionText}>
                  {item.product.priceString}
                </Text>
                <Text style={styles.descriptionText}>
                  {item?.product.description.toUpperCase()}
                </Text>
                <View style={styles.detailsView}>
                  <View>
                    {allDetails(
                      item?.identifier.includes("Gold")
                        ? "Gold Tier"
                        : "Standard Tier"
                    )}
                  </View>
                  <DividerLine
                    rotate90={true}
                    width={50}
                    color={colorsDark.accentLowOpacity}
                  />
                  <View>{allDetails("Free Tier")}</View>
                </View>
                <MainButton
                  title={"Purchase"}
                  onPress={() => {
                    setLoading(true);
                    setSelectedIndex(index);

                    purchasePackage(item).then(() => {
                      setLoading(false);
                    });
                  }}
                  marginVertical={20}
                  marginTop={30}
                  isLoading={selectedIndex === index && loading}
                  borderRadius={10}
                />
              </View>
            );
          }
        }}
      />
    </View>
  );
};

export default Subscriptions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorsDark.mainBackground,
  },
  headerText: {
    color: colorsDark.purple,
    fontSize: 20,
  },
  subSubscriptionText: {
    color: colorsDark.green,
    fontSize: 20,
    fontStyle: "italic",
    marginVertical: 10,
  },
  descriptionText: {
    color: colorsDark.white,
    fontSize: 15,
    marginVertical: 10,
  },

  purchaseItem: {
    backgroundColor: colorsDark.secondary,
    marginVertical: 30,
    borderRadius: 10,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  detailsView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  detailsText: {
    color: colorsDark.white,
    fontSize: 15,
  },
});
