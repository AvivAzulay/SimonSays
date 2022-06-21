import Sound from 'react-native-sound';

Sound.setCategory('Playback');

const simonSound1 = new Sound('simonsound1.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});
const simonSound2 = new Sound('simonsound2.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});
const simonSound3 = new Sound('simonsound3.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});
const simonSound4 = new Sound('simonsound4.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});
const wrong = new Sound('wrong.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});

const soundArray = [wrong, simonSound1, simonSound2, simonSound3, simonSound4];

export const playSound = (index: any) => {
  soundArray[index].play(success => {
    if (success) {
      console.log('successfully finished playing');
    } else {
      console.log('playback failed due to audio decoding errors');
    }
  });
};
