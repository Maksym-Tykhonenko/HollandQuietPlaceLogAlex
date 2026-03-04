import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Modal,
  useWindowDimensions,
  Share,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useStorage } from '../HollandQuietStore/placeLogContext';

const backgroundImage = require('../assets/images/holland_bg.png');
const semiBoldFont = 'Nunito-SemiBold';
const lightFont = 'Nunito-Light';
const gradPositionStart = { x: 0, y: 0 };
const gradPositionEnd = { x: 1, y: 0 };
const gradientButtonColors = ['#FF8A00', '#FF5C00'];
const mainWhite = '#FFFFFF';
const primaryDark = '#0B0B0B';

const VisitRecordsScreen = () => {
  const [activeRecord, setActiveRecord] = useState(null);
  const { height } = useWindowDimensions();
  const { records, loadRecords, deleteRecord } = useStorage();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, []),
  );

  const shareRecord = async record => {
    try {
      const message = `Place: ${record.place}\n\n${record.text}`;
      await Share.share({ message });
    } catch (error) {
      console.error('Error sharing the record', error);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ paddingTop: height * 0.1, paddingHorizontal: 16 }}>
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

          {records.length === 0 && (
            <View style={styles.emptyCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.emptyText}>
                  Here you can capture a moment. Choose a place from the list,
                  add a photo and a few words - as many as you think are
                  necessary. This entry is not for showing to others. It is your
                  own memory, preserved exactly as you remember it.
                </Text>
              </View>

              <Image
                source={require('../assets/images/warning_img.png')}
                style={styles.emptyImage}
              />
            </View>
          )}

          {records.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.recordCard}
              onPress={() => setActiveRecord(item)}
            >
              <Image source={{ uri: item.photo }} style={styles.thumb} />
              <View style={{ flex: 1 }}>
                <Text style={styles.recordTitle}>{item.place}</Text>
                <Text style={styles.recordDesc} numberOfLines={1}>
                  {item.text}
                </Text>
              </View>

              <LinearGradient
                colors={gradientButtonColors}
                style={styles.arrow}
                start={gradPositionStart}
                end={gradPositionEnd}
              >
                <Image source={require('../assets/icons/next_arr.png')} />
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.addBtnWrap}
        onPress={() => navigation.navigate('AddPlaceLogRecord')}
      >
        <LinearGradient
          colors={gradientButtonColors}
          start={gradPositionStart}
          end={gradPositionEnd}
          style={styles.addBtn}
        >
          <Text style={styles.addBtnText}>Add new record</Text>
          <Image
            source={require('../assets/icons/timer.png')}
            style={{ position: 'absolute', right: 20 }}
          />
        </LinearGradient>
      </TouchableOpacity>

      <Modal visible={!!activeRecord} transparent animationType="fade">
        {activeRecord && (
          <View style={styles.modalBg}>
            <View style={styles.modalCard}>
              <View style={styles.textContainer}>
                <Text style={styles.recordTitle}>{activeRecord.place}</Text>
              </View>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: activeRecord.photo }}
                  style={styles.modalImage}
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.recordDesc}>{activeRecord.text}</Text>
              </View>

              <View style={styles.modalBtns}>
                <TouchableOpacity
                  style={{ width: '43%' }}
                  onPress={() => {
                    deleteRecord(activeRecord.id);
                    setActiveRecord(null);
                  }}
                >
                  <LinearGradient
                    colors={['#E90606', '#E84D35']}
                    start={gradPositionStart}
                    end={gradPositionEnd}
                    style={styles.deleteBtn}
                  >
                    <Text
                      style={{ color: mainWhite, fontFamily: semiBoldFont }}
                    >
                      Delete
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => shareRecord(activeRecord)}
                  style={{ width: '43%' }}
                >
                  <LinearGradient
                    colors={gradientButtonColors}
                    start={gradPositionStart}
                    end={gradPositionEnd}
                    style={styles.shareBtn}
                  >
                    <Text
                      style={{ color: mainWhite, fontFamily: semiBoldFont }}
                    >
                      Share
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  marginTop: height * 0.08,
                  alignSelf: 'center',
                }}
              >
                <TouchableOpacity
                  onPress={() => setActiveRecord(null)}
                  activeOpacity={0.7}
                  style={{}}
                >
                  <Image source={require('../assets/icons/close_icon.png')} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </ImageBackground>
  );
};

export default VisitRecordsScreen;

const styles = StyleSheet.create({
  title: {
    color: mainWhite,
    fontSize: 18,
    fontFamily: semiBoldFont,
    alignSelf: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  imageContainer: {
    marginBottom: 17,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#090909',
    borderWidth: 1,
    borderColor: '#1A1A1A',
    padding: 20,
  },
  textContainer: {
    marginBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#191919',
    minHeight: 59,
    borderRadius: 22,
    justifyContent: 'center',
    paddingVertical: 8,
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
  emptyCard: {
    flexDirection: 'row',
    backgroundColor: primaryDark,
    borderRadius: 22,
    paddingLeft: 20,
    borderWidth: 1,
    borderColor: '#1A1A1A',
    alignItems: 'center',
    marginTop: 10,
  },
  emptyText: {
    color: mainWhite,
    fontSize: 12,
    fontFamily: lightFont,
    paddingVertical: 3,
  },
  emptyImage: {
    width: 120,
    height: 160,
    resizeMode: 'contain',
  },
  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: primaryDark,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 22,
  },
  thumb: {
    width: 54,
    height: 54,
    borderRadius: 16,
    marginRight: 10,
  },
  recordTitle: {
    color: mainWhite,
    fontFamily: semiBoldFont,
    fontSize: 14,
  },
  recordDesc: {
    color: mainWhite,
    fontFamily: lightFont,
    fontSize: 15,
  },
  arrow: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnWrap: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    width: '60%',
  },
  addBtn: {
    height: 75,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    color: mainWhite,
    fontFamily: semiBoldFont,
    fontSize: 16,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '90%',
  },
  modalImage: {
    width: '100%',
    height: 190,
    borderRadius: 16,
  },
  modalBtns: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  deleteBtn: {
    borderRadius: 12,
    height: 42,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtn: {
    borderRadius: 12,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
