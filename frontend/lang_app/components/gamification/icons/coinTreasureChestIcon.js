import { View, Text } from "react-native";
import React from "react";
import { Svg, Image, Pattern, Defs, Rect, Use } from "react-native-svg";

const CoinTreasureChestIcon = ({ size = "120" }) => {
  return (
    <View>
      <Svg
        width={size}
        height={size}
        viewBox="0 0 509 509"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xlinkHref="http://www.w3.org/1999/xlink"
      >
        <Rect width="509" height="509" fill="url(#pattern0)" />
        <Defs>
          <Pattern
            id="pattern0"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <Use xlinkHref="#image0_1966_8" transform="scale(0.000976562)" />
          </Pattern>
          <Image
            id="image0_1966_8"
            width="1024"
            height="1024"
          />
        </Defs>
      </Svg>
    </View>
  );
};

export default CoinTreasureChestIcon;