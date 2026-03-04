import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Modal,
  ScrollView,
  useWindowDimensions,
  Share,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';

const backgroundImage = require('../assets/images/holland_bg.png');
const mainWhite = '#FFFFFF';
const semiBoldFont = 'Nunito-SemiBold';
const lightFont = 'Nunito-Light';
const gradientButtonColors = ['#FF8A00', '#FF5C00'];
const gradPositionStart = { x: 0, y: 0 };
const gradPositionEnd = { x: 1, y: 0 };

const countries = [
  'America',
  'Spain',
  'United Kingdom',
  'France',
  'Germany',
  'Italy',
];

const ProfileScreen = () => {
  const [profile, setProfile] = useState(null);
  const [countryModal, setCountryModal] = useState(false);
  const { height } = useWindowDimensions();
  const navigation = useNavigation();

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const storedProfile = await AsyncStorage.getItem('userProfile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const updateProfile = async updatedData => {
    try {
      const updatedProfile = {
        ...profile,
        ...updatedData,
        lastChange: new Date().toISOString(),
      };

      setProfile(updatedProfile);
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Error updating =>', error);
    }
  };

  const getImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
      if (!response.didCancel && response.assets?.length) {
        const selectedImage = response.assets[0].uri;
        updateProfile({ photo: selectedImage });
      }
    });
  };

  if (!profile) return null;

  const handleShareProfile = () => {
    if (!profile?.name || !profile?.country) {
      console.warn('Cannot share profile.');
      return;
    }

    Share.share({
      message: `Check out my profile!\nName: ${profile.name}\nCountry: ${profile.country}`,
    }).catch(error => {
      console.error('Error sharing profile:', error);
    });
  };

  const handleDeleteProfile = async () => {
    try {
      await AsyncStorage.removeItem('userProfile');

      await AsyncStorage.removeItem('visitRecords');
      await AsyncStorage.removeItem('bookmarkedPlaces');

      setProfile(null);

      navigation.replace('LogRegistrationScreen');
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  const formatDate = date =>
    date ? new Date(date).toLocaleDateString('en-GB') : '--';

  return (
    <ImageBackground source={backgroundImage} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { paddingTop: height * 0.09 }]}>
          My profile
        </Text>

        <View style={styles.card}>
          <View style={styles.photoRow}>
            <Image source={{ uri: profile.photo }} style={styles.userImg} />

            <TouchableOpacity
              onPress={getImage}
              activeOpacity={0.8}
              style={{ flex: 1 }}
            >
              <LinearGradient
                colors={gradientButtonColors}
                start={gradPositionStart}
                end={gradPositionEnd}
                style={styles.changePhotoBtn}
              >
                <Text style={styles.changePhotoText}>Change photo</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            value={profile.name}
            onChangeText={text => updateProfile({ name: text })}
            placeholder="Your name"
            placeholderTextColor="#fff"
          />

          <TouchableOpacity
            style={styles.input}
            onPress={() => setCountryModal(true)}
            activeOpacity={0.8}
          >
            <Text style={{ color: mainWhite, fontFamily: lightFont }}>
              {profile.country}
            </Text>
          </TouchableOpacity>

          <View style={styles.datesRow}>
            <View>
              <Text style={styles.dateLabel}>Registration date:</Text>
              <Text style={styles.dateValue}>
                {formatDate(profile.registrationDate)}
              </Text>
            </View>

            <View>
              <Text style={styles.dateLabel}>First save:</Text>
              <Text style={styles.dateValue}>
                {formatDate(profile.firstSave)}
              </Text>
            </View>

            <View>
              <Text style={styles.dateLabel}>Last change:</Text>
              <Text style={styles.dateValue}>
                {formatDate(profile.lastChange)}
              </Text>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.8} onPress={handleShareProfile}>
            <LinearGradient
              colors={gradientButtonColors}
              style={styles.shareBtn}
              start={gradPositionStart}
              end={gradPositionEnd}
            >
              <Text style={styles.shareText}>Share profile</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleDeleteProfile}
            style={{ marginTop: 10 }}
          >
            <LinearGradient
              colors={gradientButtonColors}
              style={styles.shareBtn}
              start={gradPositionStart}
              end={gradPositionEnd}
            >
              <Text style={styles.shareText}>Delete profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={countryModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalBg}
          onPress={() => setCountryModal(false)}
        >
          <View style={styles.modalCard}>
            {countries.map(item => (
              <TouchableOpacity
                key={item}
                style={styles.countryItem}
                onPress={() => {
                  updateProfile({ country: item });
                  setCountryModal(false);
                }}
              >
                <Text style={{ color: mainWhite }}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </ImageBackground>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  title: {
    color: mainWhite,
    fontSize: 20,
    fontFamily: semiBoldFont,
    alignSelf: 'center',
    marginBottom: 30,
  },
  card: {
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#090909',
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userImg: {
    width: 90,
    height: 90,
    borderRadius: 22,
    marginRight: 21,
  },
  changePhotoBtn: {
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoText: {
    color: mainWhite,
    fontSize: 14,
    fontFamily: semiBoldFont,
  },
  input: {
    height: 59,
    borderRadius: 22,
    backgroundColor: '#191919',
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginBottom: 14,
    color: mainWhite,
    fontFamily: lightFont,
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    flexWrap: 'wrap',
  },
  dateLabel: {
    color: '#fff',
    fontSize: 10,
    marginBottom: 4,
    fontFamily: lightFont,
  },
  dateValue: {
    color: mainWhite,
    fontSize: 13,
    fontFamily: semiBoldFont,
  },
  shareBtn: {
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareText: {
    color: mainWhite,
    fontSize: 16,
    fontFamily: semiBoldFont,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '80%',
    backgroundColor: '#191919',
    borderRadius: 20,
    padding: 16,
  },
  countryItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
});
