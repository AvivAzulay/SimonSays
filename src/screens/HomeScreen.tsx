import {NavigationProp} from '@react-navigation/native';
import React from 'react';
import {Button, StyleSheet, View} from 'react-native';

export const HomeScreen: React.FC<{
  navigation: NavigationProp<any, any>;
}> = ({navigation: {navigate}}) => {
  return (
    <View style={styles.container}>
      <Button
        onPress={() => navigate('Game')}
        title="Start playing"
        color="#841584"
      />
      <Button
        onPress={() => navigate('Leadboard')}
        title="Leadboard"
        color="#841584"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 250,
  },
});
