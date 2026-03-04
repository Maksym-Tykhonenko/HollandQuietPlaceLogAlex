import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  useWindowDimensions,
  Share,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { hollandQuietLocations } from '../LogPlaceData/hollandQuietLocations';
import { useStorage } from '../HollandQuietStore/placeLogContext';

const backgroundImage = require('../assets/images/holland_bg.png');

const mainWhite = '#FFFFFF';
const semiBoldFont = 'Nunito-SemiBold';
const lightFont = 'Nunito-Light';
const regularFont = 'Nunito-Regular';
const gradientButtonColors = ['#FF8A00', '#FF5C00'];
const gradPositionStart = { x: 0, y: 0 };
const gradPositionEnd = { x: 1, y: 0 };

const dailyFacts = [
  'In many cities in the Netherlands, the water level in the canals is adjusted manually daily.',
  'Part of the country was created by draining the sea, not naturally.',
  'There are more bicycles in the Netherlands than officially registered residents.',
  'Some houses stand on wooden stilts that are over 300 years old.',
  'The canals in Amsterdam form rings, not a chaotic grid.',
  'Many windows traditionally do not have curtains - this is a historical feature.',
  'City trees have their own inventory numbers.',
  'Some bridges are lowered daily according to a schedule.',
  'Old warehouses are often converted into housing without changing their appearance.',
  'Many neighborhoods look completely different at night than they do during the day.',
];

const PlaceLogHomeScreen = () => {
  const [category, setCategory] = useState('Urban Silence');
  const navigation = useNavigation();
  const { height } = useWindowDimensions();
  const { loadUserProfile, profile } = useStorage();

  const dailyFact = useMemo(() => {
    return dailyFacts[Math.floor(Math.random() * dailyFacts.length)];
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUserProfile();
    }, []),
  );

  const shareDailyFact = async () => {
    try {
      if (!dailyFact) {
        console.warn('No daily fact to share.');
        return;
      }
      await Share.share({
        message: dailyFact,
      });
    } catch (error) {
      console.error('Error sharing', error);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        nestedScrollEnabled={true}
      >
        <View
          style={{
            flex: 1,
            paddingTop: height * 0.07,
            padding: 16,
            paddingBottom: 60,
          }}
        >
          {profile && (
            <View style={styles.profileCard}>
              <Image source={{ uri: profile.photo }} style={styles.userImage} />
              <View>
                <Text style={styles.helloText}>Hello, {profile.name}</Text>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}
                >
                  <Image
                    source={require('../assets/icons/ion_earth-sharp.png')}
                  />
                  <Text style={styles.countryText}>{profile.country}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.alertIcon}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('VisitRecordsScreen')}
              >
                <Image
                  source={require('../assets/icons/tdesign_chat-bubble-history-filled.png')}
                />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.factCard}>
            <View style={{ width: '50%' }}>
              <Image
                source={require('../assets/images/daily_fact_txt.png')}
                style={styles.factImage}
              />
              <Text style={styles.factText}>{dailyFact}</Text>

              <TouchableOpacity
                style={{ marginTop: 12 }}
                activeOpacity={0.7}
                onPress={shareDailyFact}
              >
                <Image
                  source={require('../assets/icons/solar_share-bold.png')}
                />
              </TouchableOpacity>
            </View>
            <Image
              source={require('../assets/images/warning_img.png')}
              style={styles.factImage}
            />
          </View>

          <View style={styles.placesSection}>
            <View style={styles.tabs}>
              {Object.keys(hollandQuietLocations).map(item => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setCategory(item)}
                  style={[styles.tab, category === item && styles.tabActive]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      category === item && styles.tabTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <ScrollView style={styles.list}>
              {hollandQuietLocations[category].map(place => (
                <View key={place.id} style={styles.placeCard}>
                  <Image
                    source={place.image}
                    style={{
                      width: 69,
                      height: 69,
                      borderRadius: 22,
                      marginRight: 6,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.placeTitle}>{place.title}</Text>
                    <Text style={styles.placeDesc} numberOfLines={3}>
                      {place.description}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.arrowBtn}
                    activeOpacity={0.7}
                    onPress={() => {
                      navigation.navigate('QuietPlaceDetails', { place });
                    }}
                  >
                    <LinearGradient
                      colors={gradientButtonColors}
                      style={styles.arrowGradient}
                      start={gradPositionStart}
                      end={gradPositionEnd}
                    >
                      <Image source={require('../assets/icons/next_arr.png')} />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 22,
    backgroundColor: '#0B0B0B',
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  userImage: {
    width: 75,
    height: 75,
    borderRadius: 22,
    marginRight: 12,
  },
  helloText: {
    color: mainWhite,
    fontSize: 19,
    fontFamily: semiBoldFont,
  },
  countryText: {
    color: mainWhite,
    fontSize: 14,
    fontFamily: regularFont,
  },
  alertIcon: {
    marginLeft: 'auto',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#090909',
    justifyContent: 'center',
    alignItems: 'center',
  },
  factCard: {
    paddingLeft: 18,
    borderRadius: 22,
    backgroundColor: '#0B0B0B',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    width: '100%',
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placesSection: {
    padding: 18,
    borderRadius: 22,
    backgroundColor: '#191919',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    maxHeight: 320,
  },
  factText: {
    color: mainWhite,
    fontSize: 12,
    fontFamily: lightFont,
    marginTop: 12,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#191919',
  },
  tabActive: {
    backgroundColor: '#0B0B0B',
  },
  tabText: {
    color: mainWhite,
    fontFamily: lightFont,
    fontSize: 13,
  },
  tabTextActive: {
    fontFamily: semiBoldFont,
  },
  list: {
    marginHorizontal: 16,
    flexGrow: 1,
  },
  placeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B0B0B',
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
  },
  placeTitle: {
    color: mainWhite,
    fontSize: 13,
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
    marginLeft: 10,
  },
  arrowGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PlaceLogHomeScreen;
