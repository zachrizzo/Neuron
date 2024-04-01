import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Animated } from 'react-native';
import { colorsDark } from '../../utility/color';

const InputBox = ({
  onChangeText,
  value,
  placeholder,
  editable = true,
  width,
  height,
  borderRadius,
  keyboardType,
  fontSize,
  textColor,
  backgroundColor,
  placeholderTextColor,
  onFocus,
  onBlur,
  margin,
  autoCapitalize = 'none',
  validate,
  formatter,
  label,
  maxLength
}) => {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [focus, setFocus] = useState(false);
  const [formattedValue, setFormattedValue] = useState(value);
  const labelTop = useRef(new Animated.Value(0)).current;

  const handleValidation = (value) => {
    if (validate && value && !focus) {
      const validationResult = validate(value);
      setError(!validationResult.isValid);
      setErrorMessage(validationResult.message || '');
    } else {
      setError(false);
      setErrorMessage('');
    }
  };

  const handleInputChange = (text) => {
    const rawValue = formatter ? formatter(text, true) : text;
    onChangeText(rawValue);
  };

  useEffect(() => {
    setFormattedValue(formatter ? formatter(value) : value);

    handleValidation(value);
  }, [value, focus]);

  const handleFocus = () => {
    if (onFocus) onFocus();
    setFocus(true);
    Animated.timing(labelTop, {
      toValue: -25,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    handleValidation(value);
    if (onBlur) onBlur();
    setFocus(false);
    if (!value) {
      Animated.timing(labelTop, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };


  return (
    <View style={{ width: width || '80%', margin: margin || 10 }}>
      <View style={styles.inputContainer}>
        {label && (
          <Animated.Text
            style={[
              styles.label,
              { transform: [{ translateY: labelTop }], fontSize: 15, color: colorsDark.accent },
            ]}
          >
            {label}
          </Animated.Text>
        )}
        <TextInput
          style={[
            styles.input,
            {
              borderColor: error ? 'red' : colorsDark.accent,
              opacity: editable ? 1 : 0.5,
              width: '100%',
              height: height || 40,
              borderRadius: borderRadius || 20,
              fontSize: fontSize || 16,
              color: textColor || '#FFFFFF',
              backgroundColor: backgroundColor || colorsDark.accent,
            },
          ]}
          keyboardType={keyboardType || 'default'}
          onChangeText={handleInputChange}
          value={formattedValue}
          placeholder={placeholder}
          keyboardAppearance="dark"
          editable={editable}
          placeholderTextColor={placeholderTextColor || '#FFFFFF8D'}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
        />
      </View>
      {error && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

export default InputBox;

const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative',
    marginHorizontal: 10,
  },
  input: {
    padding: 10,
    marginBottom: 5,
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    marginBottom: 20,
    marginHorizontal: 10,
    fontSize: 12,
    backgroundColor: 'transparent',
  },
  label: {
    position: 'absolute',
    left: 10,
    backgroundColor: 'transparent',
  },
});
