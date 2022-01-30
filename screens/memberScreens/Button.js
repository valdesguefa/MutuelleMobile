
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { t } from 'react-native-tailwindcss';
import { Button as ButtonNative } from 'react-native-paper';

export default function Button({ label,labelIcon, ...props }) {
  return (<>
    
     {/* <Text style={styles.buttonLabel}>{label}</Text>  */}
     <ButtonNative icon={labelIcon} {...props}  mode="contained" style={styles.button} >{label}</ButtonNative>
    
    </>
  );
}

const styles = {
  button: [t.selfStretch, t.bgOrange500, t.itemsCenter, t.pY2, t.rounded,{borderRadius: 15, alignSelf: 'flex-end',borderWidth: 0,}],
  buttonLabel: [t.textWhite, t.textLg]
};
