import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { colorsDark } from "../../utility/color";
import MainButton from "../buttons/mainButton";
import Icon from "../gamification/icons/icon";

const StoreItem = ({ name, price, icon, buttonOnPress, loading }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.nameText}>{name}</Text>
      <Icon icon={icon} />
      <Text style={styles.priceText}>${price}</Text>
      <MainButton isLoading={loading} title={"Buy"} onPress={buttonOnPress} />
    </View>
  );
};

export default StoreItem;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: "center",
    backgroundColor: colorsDark.accent,
    width: Dimensions.get("screen").width / 2.5,
    margin: 10,
    borderRadius: 15,
    justifyContent: "space-between",
  },
  nameText: {
    color: colorsDark.white,
    fontSize: 20,
  },
  priceText: {
    color: colorsDark.green,
    fontStyle: "italic",
    marginVertical: 10,
  },
});
