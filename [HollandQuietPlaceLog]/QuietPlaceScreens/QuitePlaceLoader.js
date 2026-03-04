import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { htmlLoader } from '../PlaceLogConstants/htmlLoader';

const QuitePlaceLoader = () => {
  const navigation = useNavigation();
  const timerRef = useRef(null);

  return (
    <ImageBackground
      style={{ flex: 1 }}
      source={require('../assets/images/holland_bg.png')}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            alignSelf: 'center',
          }}
        >
          <WebView
            originWhitelist={['*']}
            source={{ html: htmlLoader }}
            style={styles.webView}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  webView: {
    width: 360,
    height: 180,
    backgroundColor: 'transparent',
  },
});

export default QuitePlaceLoader;
