import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const backgroundImage = require('../assets/images/holland_bg.png');

const mainWhite = '#FFFFFF';
const semiBoldFont = 'Nunito-SemiBold';
const lightFont = 'Nunito-Light';
const gradientButtonColors = ['#FF8A00', '#FF5C00'];
const gradPositionStart = { x: 0, y: 0 };
const gradPositionEnd = { x: 1, y: 0 };

const SavedPlacesScreen = () => {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();
  const [savedPlaces, setSavedPlaces] = useState([]);

  useEffect(() => {
    const loadSavedPlaces = async () => {
      try {
        const storedPlaces = await AsyncStorage.getItem('bookmarkedPlaces');
        if (!storedPlaces) {
          setSavedPlaces([]);
          return;
        }

        const parsedPlaces = JSON.parse(storedPlaces);
        setSavedPlaces(Object.values(parsedPlaces));
      } catch (error) {
        console.error('Error loading bookmarked places :(', error);
      }
    };

    const unsubscribe = navigation.addListener('focus', loadSavedPlaces);
    return () => unsubscribe();
  }, [navigation]);

  if (!savedPlaces.length) {
    return (
      <ImageBackground source={backgroundImage} style={{ flex: 1 }}>
        <View style={[styles.emptyWrapper, { paddingTop: height * 0.09 }]}>
          <Text style={styles.emptyTitle}>Saved</Text>

          <View style={styles.emptyCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.emptyText}>
                Places you’ll want to return to will appear here.
                {'\n'}The list is empty for now, and that’s okay.
              </Text>
            </View>

            <Image
              source={require('../assets/images/warning_img.png')}
              style={styles.emptyImage}
            />
          </View>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={backgroundImage} style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.container, { paddingTop: height * 0.09 }]}>
          <Text style={styles.screenTitle}>Saved</Text>

          {savedPlaces.map(place => (
            <TouchableOpacity
              key={place.id}
              style={styles.placeCard}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('QuietPlaceDetails', { place })
              }
            >
              <Image source={place.image} style={styles.placeImage} />

              <View style={{ flex: 1 }}>
                <Text style={styles.placeTitle}>{place.title}</Text>
                <Text style={styles.placeDesc} numberOfLines={2}>
                  {place.description}
                </Text>
              </View>

              <View style={styles.arrowBtn}>
                <LinearGradient
                  colors={gradientButtonColors}
                  start={gradPositionStart}
                  end={gradPositionEnd}
                  style={styles.arrowGradient}
                >
                  <Image source={require('../assets/icons/next_arr.png')} />
                </LinearGradient>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default SavedPlacesScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  screenTitle: {
    color: mainWhite,
    fontSize: 20,
    fontFamily: semiBoldFont,
    textAlign: 'center',
    marginBottom: 25,
  },
  emptyWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    color: mainWhite,
    fontSize: 20,
    fontFamily: semiBoldFont,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyCard: {
    flexDirection: 'row',
    backgroundColor: '#0B0B0B',
    borderRadius: 22,
    paddingLeft: 20,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    alignItems: 'center',
    marginTop: 10,
  },
  emptyText: {
    color: mainWhite,
    fontSize: 13,
    fontFamily: lightFont,
    lineHeight: 20,
  },
  emptyImage: {
    width: 120,
    height: 160,
    resizeMode: 'contain',
  },
  placeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B0B0B',
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
  },
  placeImage: {
    width: 69,
    height: 69,
    borderRadius: 22,
    marginRight: 10,
  },
  placeTitle: {
    color: mainWhite,
    fontSize: 14,
    fontFamily: semiBoldFont,
    marginBottom: 4,
  },
  placeDesc: {
    color: '#9A9A9A',
    fontSize: 12,
    fontFamily: lightFont,
  },
  arrowBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    overflow: 'hidden',
    marginLeft: 15,
  },
  arrowGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
