import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Share,
  Linking,
  useWindowDimensions,
  ScrollView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const backgroundImage = require('../assets/images/holland_bg.png');
const logoImage = require('../assets/images/logo_about.png'); // твой логотип

const mainWhite = '#FFFFFF';
const semiBoldFont = 'Nunito-SemiBold';
const lightFont = 'Nunito-Light';
const gradPositionStart = { x: 0, y: 0 };
const gradPositionEnd = { x: 1, y: 0 };
const gradientButtonColors = ['#FF8A00', '#FF5C00'];

const AboutScreen = () => {
  const { height } = useWindowDimensions();

  const shareAboutApp = async () => {
    try {
      const appDescription = `Holland Quiet Place Log — is a space for saving places and your own
observations. The app allows you to browse a selection of locations,
work with the map, and capture moments in the form of photos and
notes. All data is stored locally on the device, without accounts or
information transfer. There is no set scenario here — only what is
important to you.`;

      await Share.share({ message: appDescription });
    } catch (error) {
      console.error('Error trying share', error);
    }
  };

  const rateApp = () => {
    const appStoreUrl =
      'https://apps.apple.com/us/app/holland-quiet-place-log/id6758064977';
    Linking.openURL(appStoreUrl).catch(error => {
      console.error('Failed to open URL:', error);
    });
  };

  return (
    <ImageBackground source={backgroundImage} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.mainBox, { paddingTop: height * 0.1 }]}>
          <Text style={styles.title}>About the app</Text>

          {Platform.OS === 'ios' ? (
            <Image
              source={logoImage}
              style={styles.logo}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={require('../assets/images/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          )}

          <Text style={styles.description}>
            Holland Quiet Place Log — is a space for saving places and your own
            observations. The app allows you to browse a selection of locations,
            work with the map, and capture moments in the form of photos and
            notes. All data is stored locally on the device, without accounts or
            information transfer. There is no set scenario here — only what is
            important to you.
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={shareAboutApp}
            style={{ width: '90%' }}
          >
            <LinearGradient
              colors={gradientButtonColors}
              style={styles.button}
              start={gradPositionStart}
              end={gradPositionEnd}
            >
              <Text style={styles.buttonText}>Share</Text>
            </LinearGradient>
          </TouchableOpacity>

          {Platform.OS === 'ios' && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={rateApp}
              style={{ width: '90%' }}
            >
              <LinearGradient
                colors={gradientButtonColors}
                start={gradPositionStart}
                end={gradPositionEnd}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Rate app</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  mainBox: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    paddingBottom: 90,
  },
  title: {
    color: mainWhite,
    fontSize: 20,
    fontFamily: semiBoldFont,
    marginBottom: 30,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 30,
    borderRadius: 12,
  },
  description: {
    color: mainWhite,
    fontSize: 14,
    fontFamily: lightFont,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 40,
  },
  button: {
    width: '100%',
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: mainWhite,
    fontSize: 16,
    fontFamily: semiBoldFont,
  },
});
