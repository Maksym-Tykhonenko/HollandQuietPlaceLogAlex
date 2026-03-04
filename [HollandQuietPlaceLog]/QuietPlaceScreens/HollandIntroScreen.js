import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  ImageBackground,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const gradientButtonColors = ['#FF8A00', '#FF5C00'];
const mainWhite = '#FFFFFF';
const gradPositionStart = { x: 0, y: 0 };
const gradPositionEnd = { x: 1, y: 0 };
const semiBoldFont = 'Nunito-SemiBold';
const backgroundImage = require('../assets/images/holland_bg.png');

const hollandIntro = [
  {
    id: '1',
    hollTitle:
      'My name is Lotte. I have collected here places that leave a mark not on the photo, but on the feelings.',
    hollImage: require('../assets/images/intro_image1.png'),
  },
  {
    id: '2',
    hollTitle:
      'You can browse locations, open them on the map, and save the ones you want to return to.',
    hollImage: require('../assets/images/intro_image2.png'),
  },
  {
    id: '3',
    hollTitle:
      'When you are in the place, add your own note: a photo, a short thought, or the mood of the moment.',
    hollImage: require('../assets/images/intro_image3.png'),
  },
  {
    id: '4',
    hollTitle:
      'Everything you add is stored only on your device. I don’t see anything and I don’t pass anything on.',
    hollImage: require('../assets/images/intro_image4.png'),
  },
];

const HollandIntroScreen = () => {
  const [mode, setMode] = useState('intro');
  const [welcomeIdx, setWelcomeIdx] = useState(0);
  const slideRef = useRef(null);
  const navigation = useNavigation();

  const { width, height } = useWindowDimensions();
  const isLandMode = width > height;

  const handleSlideSwipe = event => {
    const { contentOffset } = event.nativeEvent;
    const currentIndex = Math.round(contentOffset.x / width);
    setWelcomeIdx(currentIndex);
  };

  const handleStart = async () => {
    try {
      const storedProfile = await AsyncStorage.getItem('userProfile');

      if (storedProfile) {
        navigation.replace('PlaceLogTabs');
      } else {
        navigation.replace('LogRegistrationScreen');
      }
    } catch (error) {
      console.error('Error during start navigation:', error);

      navigation.replace('LogRegistrationScreen');
    }
  };

  if (mode === 'intro') {
    return (
      <ImageBackground
        source={backgroundImage}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.introWrapper}>
            <View style={styles.introContainer}>
              <Text style={[styles.title, { marginBottom: height * 0.07 }]}>
                Use swipes to view onboarding
              </Text>
              <Image source={require('../assets/icons/swipe_icon.png')} />
            </View>
            <View style={styles.buttonWrap}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setMode('onboarding')}
              >
                <LinearGradient
                  colors={gradientButtonColors}
                  style={styles.buttonGradient}
                  start={gradPositionStart}
                  end={gradPositionEnd}
                >
                  <Text style={styles.buttonText}>Good</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }

  const onboardSlide = ({ item, index: slideIndex }) => {
    const isLastSlide = slideIndex === hollandIntro.length - 1;

    return (
      <View
        style={[
          styles.pageRegular,
          slideIndex === 0 && { paddingBottom: 0 },
          { width },
          isLandMode && styles.pageLandscape,
        ]}
      >
        <Text style={styles.title}>{item.hollTitle}</Text>
        <Image source={item.hollImage} resizeMode="contain" />

        {isLastSlide && (
          <TouchableOpacity style={styles.button} onPress={handleStart}>
            <LinearGradient
              colors={gradientButtonColors}
              style={styles.buttonGradient}
              start={gradPositionStart}
              end={gradPositionEnd}
            >
              <Text style={styles.buttonText}>Start</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../assets/images/holland_bg.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={[styles.paginationContainer, { top: height * 0.08 }]}>
        {hollandIntro.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, welcomeIdx >= index && styles.currDot]}
          />
        ))}
      </View>

      <FlatList
        ref={slideRef}
        data={hollandIntro}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleSlideSwipe}
        keyExtractor={item => item.id}
        renderItem={onboardSlide}
      />
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  introWrapper: {
    flex: 1,
  },
  paginationContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    zIndex: 10,
  },
  dot: {
    width: 41,
    height: 7,
    borderRadius: 2,
    backgroundColor: mainWhite,
    marginHorizontal: 4,
    opacity: 0.5,
  },
  introContainer: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  currDot: {
    backgroundColor: mainWhite,
    opacity: 1,
  },
  pageRegular: {
    flex: 1,
    paddingTop: 120,
    paddingBottom: 40,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageLandscape: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  title: {
    color: mainWhite,
    fontSize: 20,
    fontFamily: semiBoldFont,
    textAlign: 'center',
    maxWidth: 300,
  },
  button: {
    width: '100%',
    maxWidth: 240,
  },
  buttonGradient: {
    height: 75,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: mainWhite,
    fontSize: 20,
    fontFamily: semiBoldFont,
  },
  buttonWrap: {
    justifyContent: 'flex-end',
    marginBottom: 40,
    width: '100%',
    alignItems: 'center',
  },
});

export default HollandIntroScreen;
