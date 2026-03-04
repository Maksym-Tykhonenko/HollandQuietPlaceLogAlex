import { NavigationContainer } from '@react-navigation/native';
import PlaceLogRoutes from './[HollandQuietPlaceLog]/HollandNavigation/PlaceLogRoutes';
import { StoreProvider } from './[HollandQuietPlaceLog]/HollandQuietStore/placeLogContext';

const App = () => {
  return (
    <NavigationContainer>
      <StoreProvider>
        <PlaceLogRoutes />
      </StoreProvider>
    </NavigationContainer>
  );
};

export default App;
