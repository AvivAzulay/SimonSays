import {NavigationProp} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Button,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {setMsDelay, setName, setNewScore} from '../store/reducers/app.reducer';
import Modal from 'react-native-modal';
import {TextInput} from 'react-native-gesture-handler';
import {useAppSelector} from '../hooks/reduxHooks';
import {playSound} from '../services/sounds';

const height = Dimensions.get('window').height;

export const GameScreen: React.FC<{
  navigation: NavigationProp<any, any>;
}> = ({navigation: {navigate}}) => {
  const {name, msDelay} = useAppSelector(state => state.gameApp);
  const [gameSequence, setGameSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isGameOn, setIsGameOn] = useState<boolean>(false);
  const [isUserPlaying, setIsUserPlaying] = useState<boolean>(false);
  const [flashedColor, setFlashedColor] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [playerName, setPlayerName] = useState<string>(name);
  const [isModalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isGameOn) {
      setRandomPanel();
      // This else state for reset all states when quiting the game while playing.
    } else resetGame();
  }, [isGameOn]);

  useEffect(() => {
    if (isGameOn && !isUserPlaying) {
      startSequence();
    }
  }, [gameSequence]);

  useEffect(() => {}, [flashedColor, msDelay, gameSequence, isUserPlaying]);

  useEffect(() => {
    if (name.length === 0) setModalVisible(true);
    if (name !== playerName) dispatch(setName(playerName));
  }, [name, playerName]);

  const setRandomPanel = async () => {
    try {
      // Wait only on the first time that user started the game.
      if (score === 0) await timeoutSequence(msDelay);
      const randomNumber = getRandomColorPick();
      if (randomNumber === gameSequence[gameSequence.length - 1]) {
        if (Math.random() > 0.5) {
          setRandomPanel();
          return;
        }
      }
      const newSequences = [...gameSequence, randomNumber];
      setGameSequence(newSequences);
      await timeoutSequence(msDelay);
      // Making game faster as user progress
      if (msDelay < 300)
        dispatch(setMsDelay(msDelay - newSequences.length * 30));
    } catch (error) {
      console.log(error);
    }
  };

  const startSequence = async () => {
    //
    // FIX - CANNOT STOP WHILE LIGHTING UP PANNELS !!!
    //
    try {
      for (let i = 0; i < gameSequence.length; i++) {
        // If user restarted the game while playing we should stop lighting up pannel sequence.
        if (!isGameOn) return;
        setFlashedColor(gameSequence[i]);
        playSound(gameSequence[i]);
        await timeoutSequence(msDelay);
        setFlashedColor(null);
        await timeoutSequence(msDelay);
      }
      // If user restarted the game while playing we shouldnt update his turn.
      isGameOn && setIsUserPlaying(true);
    } catch (error) {
      console.log(error);
    }
  };

  const timeoutSequence = async (ms: number) => {
    let timeout: NodeJS.Timer;
    return new Promise<void>(
      resolve =>
        (timeout = setTimeout(() => {
          resolve();
        }, ms)),
    )
      .catch(e => {
        clearTimeout(timeout);
      })
      .then(() => {
        clearTimeout(timeout);
      })
      .finally(() => {
        clearTimeout(timeout);
      });
  };

  const resetGame = () => {
    setIsGameOn(false);
    setIsUserPlaying(false);
    setGameSequence([]);
    setUserSequence([]);
    setFlashedColor(null);
    dispatch(setMsDelay(500));
    setScore(0);
  };

  const handlePress = async (id: number) => {
    try {
      // Checking clicks, allowed only when game active and this is the user turn
      if (!isGameOn || !isUserPlaying) return;
      const newUserSequence = [...userSequence, id];
      for (let i = 0; i < newUserSequence.length; i++) {
        // Wrong choice - gameover.
        if (newUserSequence[i] !== gameSequence[i]) {
          playSound(0);
          gameOver();
          return;
        }
      }
      // Correct choice - adding panelID to user sequence
      setUserSequence(newUserSequence);
      // Play sound
      playSound(id);
      // If user finished the sequence we will add another panel.
      if (newUserSequence.length === gameSequence.length) {
        // Lighting up panel
        setFlashedColor(id);
        await timeoutSequence(200);
        setFlashedColor(null);
        // User finished sequence, adding score
        setScore(score + 1);
        // Small delay - apllying new sequence
        await timeoutSequence(500);
        setUserSequence([]);
        setIsUserPlaying(false);
        setRandomPanel();
        return;
      }

      // Lighting up panel
      setFlashedColor(id);
      await timeoutSequence(200);
      setFlashedColor(null);
    } catch (error) {
      console.log(error);
    }
  };

  const gameOver = () => {
    if (score > 0) dispatch(setNewScore({score, name: playerName}));
    navigate('Leadboard');
    resetGame();
  };

  const getRandomColorPick = () => {
    const min = Math.ceil(1);
    const max = Math.floor(4);
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  return (
    <View>
      <Modal isVisible={isModalVisible}>
        <View>
          <Text>I am the modal content!</Text>
          <TextInput
            style={{backgroundColor: 'white'}}
            onChangeText={setPlayerName}
            value={playerName}
            placeholder="Please enter your name"
          />
          <Button
            title="Done"
            onPress={() => {
              setPlayerName;
              setModalVisible(false);
            }}
          />
        </View>
      </Modal>
      <View
        style={{
          display: 'flex',
          width: '100%',
        }}>
        <Text style={styles.name}>Hello {playerName}</Text>
      </View>
      <View style={styles.gameScreen}>
        <View style={styles.container}>
          <View style={styles.top}>
            <Pressable onPress={() => handlePress(1)}>
              <View
                style={[
                  styles.panel,
                  styles.topLeft,
                  flashedColor === 1 && styles.active,
                ]}></View>
            </Pressable>
            <Pressable onPress={() => handlePress(2)}>
              <View
                style={[
                  styles.panel,
                  styles.topRight,
                  flashedColor === 2 && styles.active,
                ]}></View>
            </Pressable>
          </View>
          <View style={styles.bottom}>
            <Pressable onPress={() => handlePress(3)}>
              <View
                style={[
                  styles.panel,
                  styles.bottomleft,
                  flashedColor === 3 && styles.active,
                ]}></View>
            </Pressable>
            <Pressable onPress={() => handlePress(4)}>
              <View
                style={[
                  styles.panel,
                  styles.bottomRight,
                  flashedColor === 4 && styles.active,
                ]}></View>
            </Pressable>
          </View>
        </View>
        <View style={styles.centerCircle}>
          <View style={styles.button}>
            <Pressable>
              <Button
                onPress={() => !isGameOn && setIsGameOn(!isGameOn)}
                title={isGameOn ? `Score: ${score}` : 'Start'}
                color="#841584"
              />
            </Pressable>
            <Text
              style={[
                styles.circle,
                {backgroundColor: isUserPlaying ? 'green' : 'red'},
              ]}></Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gameScreen: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: height,
    backgroundColor: 'black',
  },
  container: {
    position: 'relative',
  },
  top: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  bottom: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  panel: {
    width: 200,
    height: 200,
    backgroundColor: 'red',
    transition: '0.3ms',
    boxShadow: '0 0px 10px 1px grey',
    margin: 2.5,
  },
  topLeft: {
    borderTopLeftRadius: 1000,
    backgroundColor: 'green',
  },
  topRight: {
    borderTopRightRadius: 1000,
    backgroundColor: 'red',
  },
  bottomleft: {
    borderBottomLeftRadius: 1000,
    backgroundColor: 'blue',
  },
  bottomRight: {
    borderBottomRightRadius: 1000,
    backgroundColor: 'yellow',
  },
  centerCircle: {
    position: 'absolute',
    borderRadius: 1000,
    width: 200,
    height: 200,
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundColor: 'white',
  },
  button: {
    width: 120,
  },
  circle: {
    display: 'flex',
    alignSelf: 'center',
    backgroundColor: 'red',
    width: 15,
    height: 15,
    borderRadius: 100,
    marginTop: 15,
  },
  flexContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  name: {
    backgroundColor: 'black',
    color: 'white',
    display: 'flex',
    textAlign: 'center',
    width: '100%',
    fontSize: 22,
  },
});
