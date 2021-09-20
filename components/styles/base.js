import React from "react";
import { StyleSheet } from "react-native";
import {
    light,
	blueberry,
    yellow,
    pink,
    darkPurple,
    lightPurple,
    mauve,
    screenHeight,
    screenWidth,
} from "./variables";

const baseStyle = StyleSheet.create({
  shadow: {
    shadowColor: "grey",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.2,
    elevation: 4,
  },
  card: {
    shadowColor: "grey",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.2,
    elevation: 4,
    backgroundColor: "white",
    padding: 25,
    margin: 10,
    borderRadius: 5,
  },
  button: { backgroundColor: yellow, borderRadius: 40, padding: 15, width: screenWidth / 2 },
  textLarge: {
    fontSize: 25,
    marginTop: 5,
    marginBottom: 5,
    fontFamily: "Poppins",
    color: darkPurple,
  },
  textMedium: {
    fontSize: 18,
    fontFamily: "Poppins",
    color: darkPurple,
  },
  textSmall: {
    fontSize: 16,
    fontFamily: "Poppins",
    color: darkPurple,
  },
  textSmallBold: {
    fontSize: 16,
    fontFamily: "PoppinsBold",
    color: darkPurple,
    marginRight: 5,
  },
  textMini: {
    fontFamily: "Poppins",
    fontSize: 14,
    color: darkPurple,
  },
  textBold: {
    fontFamily: "PoppinsBold",
  },
  textItalic: {
    fontFamily: "PoppinsItalic",
  },

});

export default baseStyle;