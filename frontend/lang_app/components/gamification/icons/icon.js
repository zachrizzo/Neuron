import { StyleSheet, Text, View } from "react-native";
import React from "react";
import CoinTreasureChestIcon from "./coinTreasureChestIcon";
import HeartsLockerIcon from "./heartsLockerIcon";
import AiMessagesIcon from "./aiMessagesIcon";
import StreakFreezeIcon from "./streakFreezeIcon";

const Icon = ({ icon }) => {
  if (icon == "treasureChest") {
    return <CoinTreasureChestIcon />;
  }
  if (icon == "heartsLocker") {
    return <HeartsLockerIcon />;
  }
  if (icon == "aiMessages") {
    return <AiMessagesIcon />;
  }
  if (icon == "streakFreeze") {
    return <StreakFreezeIcon />;
  }
};

export default Icon;

const styles = StyleSheet.create({});
