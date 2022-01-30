import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

function RoundButton() {
  const buttonClickedHandler = () => {
    console.log('You have been clicked a button!');
    // do something
  };

  return (
    <View style={styles.screen}>
      <TouchableOpacity
        onPress={buttonClickedHandler}
        style={styles.roundButton1}>
        <Text>I'm a button</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={buttonClickedHandler}
        style={styles.roundButton2}>
        <Text>I'm another button</Text>
      </TouchableOpacity>
    </View>
  );
}

export default RoundButton;

/// Just some styles
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundButton1: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: 'orange',
  },
  roundButton2: {
    marginTop: 20,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: '#ccc',
  },
});