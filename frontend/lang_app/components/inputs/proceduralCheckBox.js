import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { CheckBoxWithLabel } from "./checkBoxWithLabel"; // Update the import path accordingly

/**
 * Renders a procedural checkbox component.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.options - The array of checkbox options.
 * @param {Function} props.onUpdateSelectedOptions - The function to update the selected options.
 * @param {Array} [props.defaultValues=[]]  - The default selected options.
 * @param {boolean} [props.multiSelect=false] - Indicates if multiple options can be selected.
 * @param {boolean} [props.horizontal] - Indicates if the checkboxes should be displayed horizontally.
 * @param {string} [props.testID] - The test ID for testing purposes.
 * @param {string} [props.textColor] - The color of the checkbox text.
 * @param {string} [props.boxShadow] - The CSS box shadow for the checkboxes.
 * @returns {JSX.Element} The rendered procedural checkbox component.
 */
export default function ProceduralCheckBox({
  options,
  onUpdateSelectedOptions,
  defaultValues = [] || '',
  multiSelect = false,
  horizontal,
  testID,
  textColor,
  boxShadow,
}) {
  const [selectedOptions, setSelectedOptions] = useState(defaultValues);

  useEffect(() => {
    if (
      !selectedOptions.includes(defaultValues) &&
      defaultValues.length > 0 &&
      defaultValues[0].length > 0
    ) {
      setSelectedOptions(defaultValues);
    }
  }, [defaultValues]);

  useEffect(() => {
    if (multiSelect) {
      onUpdateSelectedOptions(selectedOptions);
    } else {
      onUpdateSelectedOptions([selectedOptions]); // Wrap selectedOptions in an array
    }
  }, [selectedOptions, onUpdateSelectedOptions, multiSelect]);

  const handleSelectionChange = (option) => {
    if (multiSelect) {
      setSelectedOptions((prevSelectedOptions) =>
        prevSelectedOptions.includes(option)
          ? prevSelectedOptions.filter((opt) => opt !== option)
          : [...prevSelectedOptions, option]
      );
    } else {
      setSelectedOptions(option); // Change this line
    }
  };

  return (
    <View style={[styles.container, horizontal && styles.horizontal]}>
      {options.map((option, index) => (
        <View style={styles.optionContainer} key={index}>
          <CheckBoxWithLabel
            textColor={textColor}
            key={option}
            text={option}
            checked={selectedOptions.includes(option)}
            setChecked={() => handleSelectionChange(option)}
            checkBoxOnTheLeft
            margin={3}
            testID={`checkbox-${option}`}
            shadow={boxShadow}
          />
        </View>
      ))}
    </View>
  );
}

ProceduralCheckBox.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onUpdateSelectedOptions: PropTypes.func.isRequired,
  defaultValues: PropTypes.arrayOf(PropTypes.string) || PropTypes.string,
  multiSelect: PropTypes.bool,
  horizontal: PropTypes.bool,
  testID: PropTypes.string,
  textColor: PropTypes.string,
  boxShadow: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "80%",
  },
  horizontal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  optionContainer: {
    paddingVertical: 8,
  },
});
