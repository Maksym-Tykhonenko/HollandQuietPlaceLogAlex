import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Modal,
  TextInput,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';

const gradientButtonColors = ['#FF8A00', '#FF5C00'];
const gradStart = { x: 0, y: 0 };
const gradEnd = { x: 1, y: 0 };
const mainWhite = '#FFFFFF';
const semiBoldFont = 'Nunito-SemiBold';
const lightFont = 'Nunito-Light';

const backgroundImage = require('../assets/images/holland_bg.png');
const cameraIcon = require('../assets/icons/camera_icon.png');

const countries = [
  'America',
  'Spain',
  'United Kingdom',
  'France',
  'Germany',
  'Italy',
];

const LogRegistrationScreen = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [photo, setPhoto] = useState(null);
  const [countryModal, setCountryModal] = useState(false);

  const navigation = useNavigation();
  const { height } = useWindowDimensions();

  const getImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
      const { didCancel, assets } = response;
      if (!didCancel && assets?.length) {
        setPhoto(assets[0].uri);
      }
    });
  };

  const saveUserProfile = async () => {
    try {
      const now = new Date().toISOString();

      const newUserProfile = {
        name,
        country,
        photo,
        registrationDate: now,
        firstSave: now,
        lastChange: now,
      };

      await AsyncStorage.setItem('userProfile', JSON.stringify(newUserProfile));

      navigation.replace('PlaceLogTabs');
    } catch (error) {
      console.error('Failed save', error);
    }
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.mainContainer, { paddingTop: height * 0.07 }]}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Registration </Text>
            <Text style={styles.headerText}>{step}/2</Text>
          </View>

          {step === 1 && (
            <View style={styles.card}>
              <View style={styles.warningBox}>
                <View style={{ paddingVertical: 16, width: '50%' }}>
                  <Image
                    source={require('../assets/images/warning_text.png')}
                  />
                  <Text style={styles.warningText}>
                    I will ask for a minimum of information — just for your
                    convenience. Everything you add in this app is stored only
                    on your device.
                  </Text>
                </View>
                <Image source={require('../assets/images/warning_img.png')} />
              </View>

              <View style={styles.inputsContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Your name"
                  placeholderTextColor={mainWhite}
                  value={name}
                  onChangeText={setName}
                  maxLength={15}
                />

                <TouchableOpacity
                  style={[styles.input, { marginBottom: 0 }]}
                  onPress={() => setCountryModal(true)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={{
                      color: country ? mainWhite : '#fff',
                      fontFamily: lightFont,
                    }}
                  >
                    {country || 'Where are you from?'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonPositioning}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.button}
                  disabled={!name || !country}
                  onPress={() => setStep(2)}
                >
                  <LinearGradient
                    colors={gradientButtonColors}
                    style={styles.buttonGradient}
                    start={gradStart}
                    end={gradEnd}
                  >
                    <Text style={styles.buttonText}>Next</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.card}>
              <View style={[styles.inputsContainer, { marginTop: 30 }]}>
                <TouchableOpacity
                  style={styles.photoBox}
                  onPress={getImage}
                  activeOpacity={0.8}
                >
                  {photo ? (
                    <Image source={{ uri: photo }} style={styles.photo} />
                  ) : (
                    <Image source={cameraIcon} />
                  )}
                </TouchableOpacity>

                {photo && (
                  <TouchableOpacity
                    style={styles.changePhotoButton}
                    onPress={getImage}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={gradientButtonColors}
                      style={styles.changePhotoGradient}
                      start={gradStart}
                      end={gradEnd}
                    >
                      <Text style={styles.changePhotoText}>Change photo</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.buttonPositioning}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={saveUserProfile}
                  disabled={!photo}
                >
                  <LinearGradient
                    colors={gradientButtonColors}
                    style={styles.saveGradient}
                    start={gradStart}
                    end={gradEnd}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal visible={countryModal} transparent animationType="fade">
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.modalBg}
          onPress={() => setCountryModal(false)}
        >
          <View style={styles.modalCard}>
            {countries.map(item => (
              <TouchableOpacity
                activeOpacity={0.8}
                key={item}
                style={styles.countryItem}
                onPress={() => {
                  setCountry(item);
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

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingBottom: 40,
    padding: 16,
  },
  header: {
    marginBottom: 10,
    alignSelf: 'center',
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#090909',
    borderWidth: 1,
    borderColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  warningBox: {
    marginBottom: 20,
    backgroundColor: '#090909',
    borderRadius: 22,
    paddingLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#1A1A1A',
    width: '100%',
  },
  inputsContainer: {
    marginBottom: 20,
    backgroundColor: '#090909',
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A1A1A',
    width: '100%',
  },
  headerText: {
    color: mainWhite,
    fontSize: 24,
    fontFamily: semiBoldFont,
  },
  card: {
    marginBottom: 40,
    width: '100%',
    flex: 1,
  },
  buttonPositioning: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  changePhotoButton: {
    marginBottom: 30,
    width: '100%',
  },
  changePhotoGradient: {
    height: 59,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoText: {
    color: mainWhite,
    fontSize: 16,
    fontFamily: lightFont,
  },
  saveButton: {
    marginTop: 10,
    width: 241,
  },
  saveGradient: {
    height: 75,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningText: {
    color: mainWhite,
    fontSize: 12,
    marginTop: 13,
    fontFamily: lightFont,
  },
  input: {
    height: 56,
    borderRadius: 22,
    backgroundColor: '#191919',
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginBottom: 14,
    color: mainWhite,
    width: '100%',
    fontFamily: lightFont,
  },
  button: {
    marginTop: 20,
  },
  buttonGradient: {
    height: 75,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    width: 241,
  },
  buttonText: {
    color: mainWhite,
    fontSize: 20,
    fontFamily: semiBoldFont,
  },
  photoBox: {
    width: 200,
    height: 200,
    borderRadius: 22,
    backgroundColor: '#191919',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 30,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
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

export default LogRegistrationScreen;
