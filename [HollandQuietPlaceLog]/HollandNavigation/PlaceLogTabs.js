import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Platform, StyleSheet, useWindowDimensions } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import PlaceLogHome from '../QuietPlaceScreens/PlaceLogHome';
import PlaceLogSaved from '../QuietPlaceScreens/PlaceLogSaved';
import HollandQuiteMap from '../QuietPlaceScreens/HollandQuiteMap';
import PlaceLogProfile from '../QuietPlaceScreens/PlaceLogProfile';
import HollandAboutScreen from '../QuietPlaceScreens/HollandAboutScreen';

const Tab = createBottomTabNavigator();

const PlaceLogTabs = () => {
  const { height } = useWindowDimensions();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.bottomTabs,
          {
            height: height * 0.13,
          },
        ],
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#575757',
      }}
    >
      <Tab.Screen
        name="PlaceLogHome"
        component={PlaceLogHome}
        options={{ unmountOnBlur: true }}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../assets/icons/fluent_home-32-filled.png')}
              tintColor={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="PlaceLogSaved"
        component={PlaceLogSaved}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../assets/icons/lets-icons_bookmark-fill.png')}
              tintColor={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="HollandQuiteMap"
        component={HollandQuiteMap}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../assets/icons/tabler_map-pin-filled.png')}
              tintColor={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="PlaceLogProfile"
        component={PlaceLogProfile}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../assets/icons/iconamoon_profile-fill.png')}
              tintColor={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="HollandAboutScreen"
        component={HollandAboutScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../assets/icons/iconoir_info-circle-solid.png')}
              tintColor={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  bottomTabs: {
    marginHorizontal: 20,
    elevation: 0,
    paddingTop: 30,
    justifyContent: 'center',
    position: 'absolute',
    paddingHorizontal: 6,
    borderTopColor: '#191919',
    backgroundColor: '#191919',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height: 127,
    paddingBottom: 60,
  },
});

export default PlaceLogTabs;
