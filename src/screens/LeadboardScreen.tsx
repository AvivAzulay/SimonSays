import {NavigationProp} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Button, Pressable, StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {useAppSelector} from '../hooks/reduxHooks';
import {getData} from '../services/asyncStorage';
import {setScoresFromAsyncStorage} from '../store/reducers/app.reducer';

export const LeadboardScreen: React.FC<{
  navigation: NavigationProp<any, any>;
}> = ({navigation: {navigate}}) => {
  const dispatch = useDispatch();
  const numberOfRecords: number = 10;
  let {leadboardScores} = useAppSelector(state => state.gameApp);

  useEffect(() => {
    const fetchScoresFromAsyncStorage = async () => {
      try {
        const scores = await getData('scores');
        dispatch(setScoresFromAsyncStorage(scores));
      } catch (error) {
        console.log(error);
      }
    };
    if (leadboardScores.length === 0) fetchScoresFromAsyncStorage();
  }, []);

  const newestLeadboardScores = () => {
    return [...leadboardScores].reverse();
  };
  return (
    <>
      <Text style={styles.header}>Leadboard</Text>
      <View style={styles.container}>
        {newestLeadboardScores().map((score, idx) => {
          if (idx < numberOfRecords)
            return (
              <Text style={styles.row} key={idx}>
                Player name:{score.name} - Score: {score.score}
              </Text>
            );
        })}
      </View>

      <Pressable style={styles.button}>
        <Button
          onPress={() => navigate('Game')}
          title="Start new game"
          color="#841584"
        />
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 22,
    display: 'flex',
    alignSelf: 'center',
    marginTop: 25,
    marginBottom: 25,
  },
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  row: {
    marginBottom: 10,
    borderBottomWidth: 0.5,
  },
  button: {
    display: 'flex',
    alignSelf: 'center',
    width: 150,
    marginTop: 15,
  },
});
