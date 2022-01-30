import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { t } from 'react-native-tailwindcss';
import RN from 'react-native';
import * as Animatable from 'react-native-animatable';

//import { Input as InputElement, Icon } from 'react-native-elements';
/*
 <Input
        placeholder='INPUT WITH ICON'
        label='bjr msr'
        leftIcon={{ type: 'font-awesome', name: 'chevron-left' }}
      />
      */

const SCREEN_WIDTH = RN.Dimensions.get('window').width;
const SCREEN_HEIGHT = RN.Dimensions.get('window').height;

import { TextInput } from 'react-native-paper';

export default function Input(props) {
  useEffect(() => {

  }, [props])
  return (
    <View style={styles.wrapper}>
      <TextInput
        mode='outlined'
        {...props}

        style={[styles.input, styles.inputStyle, props.error && t.borderRed500, props.style]}
      />
      {props.errorText && (
        <>
          <Animatable.Text duration={1000} animation={'bounce'} style={styles.errorText}>{props.errorText}</Animatable.Text>
        </>
      )
      }
      {props.MyerrorText && (
        <>
          <Animatable.Text duration={1000} animation={'bounce'} style={styles.errorText}>{props.MyerrorText}</Animatable.Text>
        </>
      )
      }

    </View>
  );
}

const styles = {
  inputStyle: {
    flex: 1,
    borderWidth: 0,
    height: 45,
    width: SCREEN_WIDTH * 0.8,
    height:SCREEN_HEIGHT * 0.055,
  },
  wrapper: [t.selfStretch, t.mB2],
  input: [
    t.h11,
    t.border,
    t.selfStretch,
    t.p2,
    t.borderGray500,
    t.rounded,
    t.textBase,
    t.textGray700
  ],
  errorText: [t.mT1, t.textRed500]
};
