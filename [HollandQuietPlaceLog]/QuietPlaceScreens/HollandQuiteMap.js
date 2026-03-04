import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { hollandQuietLocations } from '../LogPlaceData/hollandQuietLocations';

const backgroundImage = require('../assets/images/holland_bg.png');
const gradientButtonColors = ['#FF8A00', '#FF5C00'];
const mainWhite = '#FFFFFF';
const semiBoldFont = 'Nunito-SemiBold';
const lightFont = 'Nunito-Light';
const gradPositionStart = { x: 0, y: 0 };
const gradPositionEnd = { x: 1, y: 0 };

const MapWithPlacesScreen = () => {
  const navigation = useNavigation();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const { height } = useWindowDimensions();

  useFocusEffect(
    useCallback(() => {
      return () => setSelectedPlace(null);
    }, []),
  );

  const allMapLocations = Object.values(hollandQuietLocations).flat();

  return (
    <ImageBackground source={backgroundImage} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, paddingBottom: 90 }}>
          <Text style={[styles.title, { paddingTop: height * 0.1 }]}>
            Map with place
          </Text>

          <View style={styles.mapWrapper}>
            <MapView
              style={StyleSheet.absoluteFill}
              userInterfaceStyle="dark"
              initialRegion={{
                latitude: 52.37,
                longitude: 4.89,
                latitudeDelta: 0.25,
                longitudeDelta: 0.25,
              }}
            >
              {allMapLocations.map(place => (
                <Marker
                  key={place.id}
                  coordinate={{
                    latitude: place.coordinates.lat,
                    longitude: place.coordinates.lng,
                  }}
                  onPress={() => {
                    selectedPlace === place
                      ? setSelectedPlace(null)
                      : setSelectedPlace(place);
                  }}
                >
                  {selectedPlace === place ? (
                    <Image
                      source={require('../assets/icons/selected_marker.png')}
                    />
                  ) : (
                    <Image
                      source={require('../assets/icons/map_marker.png')}
                      style={{ width: 34, height: 34 }}
                    />
                  )}
                </Marker>
              ))}
            </MapView>

            {selectedPlace && (
              <View style={styles.card}>
                <Image source={selectedPlace.image} style={styles.cardImage} />

                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{selectedPlace.title}</Text>
                  <Text style={styles.cardDesc} numberOfLines={2}>
                    {selectedPlace.description}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('QuietPlaceDetails', {
                      place: selectedPlace,
                    })
                  }
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={gradientButtonColors}
                    style={styles.arrowBtn}
                    start={gradPositionStart}
                    end={gradPositionEnd}
                  >
                    <Image source={require('../assets/icons/next_arr.png')} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default MapWithPlacesScreen;

const styles = StyleSheet.create({
  title: {
    color: mainWhite,
    fontSize: 20,
    alignSelf: 'center',
    marginBottom: 12,
    fontFamily: semiBoldFont,
  },
  mapWrapper: {
    width: '90%',
    height: '68%',
    alignSelf: 'center',
    margin: 16,
    borderRadius: 28,
    overflow: 'hidden',
  },
  card: {
    position: 'absolute',
    top: 26,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B0B0B',
    borderRadius: 22,
    padding: 14,
    width: '85%',
    alignSelf: 'center',
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 20,
    marginRight: 10,
  },
  cardTitle: {
    color: mainWhite,
    fontSize: 14,
    fontFamily: semiBoldFont,
    marginBottom: 4,
  },
  cardDesc: {
    color: '#aaa',
    fontSize: 12,
    fontFamily: lightFont,
  },
  arrowBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});
