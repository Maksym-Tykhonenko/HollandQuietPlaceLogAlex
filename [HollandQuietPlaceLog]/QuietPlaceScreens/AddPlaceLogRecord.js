import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const backgroundImage = require('../assets/images/holland_bg.png');
const semiBoldFont = 'Nunito-SemiBold';
const lightFont = 'Nunito-Light';
const gradPositionStart = { x: 0, y: 0 };
const gradPositionEnd = { x: 1, y: 0 };
const gradientButtonColors = ['#FF8A00', '#FF5C00'];
const mainWhite = '#fff';

const placesToVisit = [
  'Begijnhof, Amsterdam',
  'Oudezijds Kolk',
  'Jordaan Side Streets',
  'Haarlemmerdijk Back Area',
  'Plantage Neighborhood',
  'Weteringstraat Area',
  'Eastern Docklands Quiet Zones',
  'Zaanse Schans Riverside',
  'Markermeer Shoreline',
  'Afsluitdijk Viewpoint',
  'Noordwijk Dunes Edge',
  'IJsselmeer Open Bank',
  'Lauwersmeer Calm Zone',
  'Wadden Sea Dike Path',
  'Hofjes of Haarlem',
  'De Negen Straatjes Back Corners',
  'Delft Inner Courtyards',
  'Utrecht Canal Steps',
  'Leiden Side Alleys',
  'Rotterdam Old Harbor Edge',
  'Groningen Hidden Passages',
];

const AddPlaceLogRecord = () => {
  const [place, setPlace] = useState('');
  const [photo, setPhoto] = useState(null);
  const [text, setText] = useState('');
  const [openSelect, setOpenSelect] = useState(false);
  const { height } = useWindowDimensions();
  const navigation = useNavigation();

  const getPhoto = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
      if (!response.didCancel && response.assets?.length) {
        const selectedPhoto = response.assets[0].uri;
        setPhoto(selectedPhoto);
      }
    });
  };

  const saveRecord = async () => {
    try {
      const storedRecords = await AsyncStorage.getItem('visitRecords');
      const existingRecords = storedRecords ? JSON.parse(storedRecords) : [];

      const newRecord = {
        id: Date.now().toString(),
        place,
        photo,
        text,
        date: new Date().toISOString(),
      };

      const updatedRecords = [newRecord, ...existingRecords];
      await AsyncStorage.setItem(
        'visitRecords',
        JSON.stringify(updatedRecords),
      );

      console.log('Saved');

      navigation.goBack();
    } catch (error) {
      console.error('Failed to save', error);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={{ paddingTop: height * 0.1 }}>
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
            <Text style={styles.headerTitle}>My visit records</Text>
          </View>

          <View style={styles.selectWrapper}>
            <View style={styles.bgCardWrapper}>
              <TouchableOpacity
                style={styles.selectHeader}
                onPress={() => setOpenSelect(!openSelect)}
                activeOpacity={0.8}
              >
                <Text style={[styles.selectText, !place && { color: '#fff' }]}>
                  {place || 'Choose a place you visited:'}
                </Text>
                <Image source={require('../assets/icons/down.png')} />
              </TouchableOpacity>
            </View>

            {openSelect && (
              <View style={styles.selectList}>
                <ScrollView>
                  {placesToVisit.map(p => (
                    <TouchableOpacity
                      key={p}
                      style={styles.placeItem}
                      onPress={() => {
                        setPlace(p);
                        setOpenSelect(false);
                      }}
                    >
                      <Text style={styles.placeText}>{p}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.bgCardWrapper}>
            <TouchableOpacity
              style={styles.photoBox}
              onPress={getPhoto}
              activeOpacity={0.8}
            >
              {photo ? (
                <Image source={{ uri: photo }} style={styles.photo} />
              ) : (
                <Image source={require('../assets/icons/camera_icon.png')} />
              )}
            </TouchableOpacity>
          </View>

          <View style={[styles.bgCardWrapper, { marginVertical: 16 }]}>
            <TextInput
              style={styles.input}
              placeholder="Mini-description"
              placeholderTextColor="#fff"
              value={text}
              onChangeText={setText}
              maxLength={60}
              multiline
            />
          </View>

          {photo && place && (
            <TouchableOpacity
              disabled={!place || !photo}
              onPress={saveRecord}
              activeOpacity={0.9}
              style={{ width: '60%  ', alignSelf: 'center', marginTop: 10 }}
            >
              <LinearGradient
                colors={gradientButtonColors}
                start={gradPositionStart}
                end={gradPositionEnd}
                style={[styles.saveBtn]}
              >
                <Text style={styles.saveText}>Save</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default AddPlaceLogRecord;

const styles = StyleSheet.create({
  bgCardWrapper: {
    backgroundColor: '#0B0B0B',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    padding: 20,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  headerTitle: {
    color: mainWhite,
    fontSize: 20,
    fontFamily: semiBoldFont,
  },
  title: {
    color: mainWhite,
    fontSize: 18,
    marginLeft: 12,
    fontFamily: semiBoldFont,
  },
  selectWrapper: {
    marginBottom: 20,
  },
  selectHeader: {
    backgroundColor: '#191919',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
  },
  selectList: {
    backgroundColor: '#191919',
    borderRadius: 20,
    marginTop: 8,
    maxHeight: 200,
    paddingVertical: 8,
  },
  placeItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  placeText: {
    color: mainWhite,
    fontSize: 14,
    fontFamily: lightFont,
  },
  photoBox: {
    height: 200,
    backgroundColor: '#191919',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  input: {
    backgroundColor: '#191919',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: mainWhite,
    fontFamily: lightFont,
  },
  saveBtn: {
    height: 75,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: {
    color: mainWhite,
    fontSize: 16,
    fontFamily: semiBoldFont,
  },
});
