import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Share,
  useWindowDimensions,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

const backgroundImage = require('../assets/images/holland_bg.png');
const mainWhite = '#FFFFFF';
const semiBoldFont = 'Nunito-SemiBold';
const lightFont = 'Nunito-Light';
const gradientButtonColors = ['#FF8A00', '#FF5C00'];
const gradPositionStart = { x: 0, y: 0 };
const gradPositionEnd = { x: 1, y: 0 };

const QuietPlaceDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { place } = route.params;
  const { height } = useWindowDimensions();
  const [showMap, setShowMap] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const storedPlaces = await AsyncStorage.getItem('bookmarkedPlaces');
        if (!storedPlaces) return;

        const bookmarkedPlaces = JSON.parse(storedPlaces);
        if (bookmarkedPlaces[place.id]) {
          setSaved(true);
        } else {
          setSaved(false);
        }
      } catch (error) {
        console.error('Error checking place =>', error);
      }
    };

    checkIfSaved();
  }, [place.id]);

  const toggleSave = async () => {
    try {
      const storedPlaces = await AsyncStorage.getItem('bookmarkedPlaces');
      const bookmarkedPlaces = storedPlaces ? JSON.parse(storedPlaces) : {};

      if (bookmarkedPlaces[place.id]) {
        delete bookmarkedPlaces[place.id];
        setSaved(false);

        console.log('removed');
      } else {
        bookmarkedPlaces[place.id] = place;
        setSaved(true);

        console.log('added');
      }

      await AsyncStorage.setItem(
        'bookmarkedPlaces',
        JSON.stringify(bookmarkedPlaces),
      );
    } catch (error) {
      console.error('Error toggling save status:', error);
    }
  };

  const sharePlace = async () => {
    try {
      if (!place?.title || !place?.description || !place?.coordinates) {
        console.warn('Incomplete place data. Cannot share.');
        return;
      }

      const { title, description, coordinates } = place;
      const message = `${title}\n\n${description}\n\nCoordinates: ${coordinates.lat}, ${coordinates.lng}`;

      await Share.share({ message });
    } catch (error) {
      console.error('Error sharing :(', error);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={[styles.container, { paddingTop: height * 0.09 }]}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={gradientButtonColors}
                start={gradPositionStart}
                end={gradPositionEnd}
                style={styles.backBtn}
              >
                <Image source={require('../assets/icons/back_arr.png')} />
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{place.title}</Text>
          </View>

          {showMap ? (
            <View>
              <View style={[styles.mapWrapper, { height: height * 0.6 }]}>
                <MapView
                  style={styles.map}
                  userInterfaceStyle="dark"
                  initialRegion={{
                    latitude: place.coordinates.lat,
                    longitude: place.coordinates.lng,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: place.coordinates.lat,
                      longitude: place.coordinates.lng,
                    }}
                  >
                    <Image
                      source={require('../assets/icons/map_marker.png')}
                      resizeMode="contain"
                    />
                  </Marker>
                </MapView>
              </View>

              <View style={styles.backButtonWrap}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.closeMapBtn}
                  onPress={() => setShowMap(false)}
                >
                  <LinearGradient
                    colors={gradientButtonColors}
                    start={gradPositionStart}
                    end={gradPositionEnd}
                    style={styles.closeGradient}
                  >
                    <Text style={styles.buttonText}>Close map</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <Image source={place.image} style={styles.image} />

              <Text style={styles.coords}>
                Coordinates: {place.coordinates.lat}, {place.coordinates.lng}
              </Text>
              <Text style={styles.description}>{place.description}</Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={sharePlace}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={gradientButtonColors}
                    start={gradPositionStart}
                    end={gradPositionEnd}
                    style={styles.actionGradient}
                  >
                    <Text style={styles.buttonText}>Share</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.actionBtn}
                  onPress={() => setShowMap(true)}
                >
                  <LinearGradient
                    colors={gradientButtonColors}
                    start={gradPositionStart}
                    end={gradPositionEnd}
                    style={styles.actionGradient}
                  >
                    <Text style={styles.buttonText}>On map</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.bookmarkBtn}
                  onPress={toggleSave}
                  activeOpacity={0.7}
                >
                  <Image
                    source={
                      saved
                        ? require('../assets/icons/saved_bookmark.png')
                        : require('../assets/icons/save_bookmark.png')
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {Platform.OS === 'android' && (
          <Image
            source={require('../assets/images/ball.png')}
            style={{
              width: 320,
              height: 220,
              alignSelf: 'flex-end',
              right: -90,
            }}
          />
        )}
      </ScrollView>
    </ImageBackground>
  );
};

export default QuietPlaceDetails;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },

  backButtonWrap: {
    alignItems: 'center',
    backgroundColor: '#090909',
    padding: 28,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 22,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    color: mainWhite,
    fontSize: 20,
    fontFamily: semiBoldFont,
  },
  image: {
    width: '100%',
    height: 280,
    borderRadius: 22,
    marginBottom: 16,
  },
  coords: {
    color: mainWhite,
    fontSize: 20,
    fontFamily: semiBoldFont,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    color: mainWhite,
    fontSize: 14,
    fontFamily: lightFont,
    lineHeight: 19,
    marginBottom: 24,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#090909',
    padding: 28,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    borderRadius: 22,
  },
  actionBtn: {
    flex: 1,
    marginRight: 8,
  },
  actionGradient: {
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0B0B0B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: mainWhite,
    fontFamily: semiBoldFont,
  },
  mapWrapper: {
    flex: 1,
    width: '100%',

    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  closeMapBtn: {
    width: 140,
  },
  closeGradient: {
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
