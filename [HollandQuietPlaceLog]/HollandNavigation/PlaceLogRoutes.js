import { createStackNavigator } from '@react-navigation/stack';
import HollandIntroScreen from '../QuietPlaceScreens/HollandIntroScreen';
import QuitePlaceLoader from '../QuietPlaceScreens/QuitePlaceLoader';
import LogRegistrationScreen from '../QuietPlaceScreens/LogRegistrationScreen';
import PlaceLogTabs from './PlaceLogTabs';
import QuietPlaceDetails from '../QuietPlaceScreens/QuitePlaceDetails';
import VisitRecordsScreen from '../QuietPlaceScreens/VisitRecordsScreen';
import AddPlaceLogRecord from '../QuietPlaceScreens/AddPlaceLogRecord';
import ProductScreen from '../QuietPlaceScreens/ProductScreen';
import React, { useState, useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Dimensions,
  View,
  Image,
  StatusBar,
} from 'react-native';

const Stack = createStackNavigator();
//<Stack.Screen name="QuitePlaceLoader" component={QuitePlaceLoader} />
// stack nav screens
// libs
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import AppleAdsAttribution from '@vladikstyle/react-native-apple-ads-attribution';
import DeviceInfo from 'react-native-device-info';
import Tenjin from 'react-native-tenjin';
import ReactNativeIdfaAaid, {
  AdvertisingInfoResponse,
} from '@sparkfabrik/react-native-idfa-aaid';

const PlaceLogRoutes = () => {
  const [route, setRoute] = useState(false);
  //console.log('route===>', route)
  const [responseToPushPermition, setResponseToPushPermition] = useState(false);
  ////('Дозвіл на пуши прийнято? ===>', responseToPushPermition);
  const [uniqVisit, setUniqVisit] = useState(true);
  //console.log('uniqVisit===>', uniqVisit);
  const [addPartToLinkOnce, setAddPartToLinkOnce] = useState(true);
  //console.log('addPartToLinkOnce in App==>', addPartToLinkOnce);
  //////////////////Parametrs
  const [idfa, setIdfa] = useState(false);
  //console.log('idfa==>', idfa);//
  const [oneSignalId, setOneSignalId] = useState(null);
  //console.log('oneSignalId==>', oneSignalId);
  const [appsUid, setAppsUid] = useState(null);
  const [sab1, setSab1] = useState();
  const [atribParam, setAtribParam] = useState(null);
  //const [pid, setPid] = useState();
  console.log('atribParam==>', atribParam);
  //console.log('sab1==>', sab1);
  //console.log('pid==>', pid);
  const [customerUserId, setCustomerUserId] = useState(null);
  //console.log('customerUserID==>', customerUserId);
  const [idfv, setIdfv] = useState();
  //console.log('idfv==>', idfv);
  /////////Atributions
  const [adServicesAtribution, setAdServicesAtribution] = useState(null);
  //const [adServicesKeywordId, setAdServicesKeywordId] = useState(null);
  const [isDataReady, setIsDataReady] = useState(false);
  const [aceptTransperency, setAceptTransperency] = useState(false);
  const [completeLink, setCompleteLink] = useState(false);
  const [finalLink, setFinalLink] = useState('');
  //console.log('completeLink==>', completeLink);
  //console.log('finalLink==>', finalLink);
  const [isInstallConversionDone, setIsInstallConversionDone] = useState(false);
  const [pushOpenWebview, setPushOpenWebview] = useState(false);
  //console.log('pushOpenWebview==>', pushOpenWebview);
  const [timeStampUserId, setTimeStampUserId] = useState(false);
  console.log('timeStampUserId==>', timeStampUserId);
  const [checkApsData, setCheckApsData] = useState(null);
  const [checkAsaData, setCheckAsaData] = useState(null);
  const [cloacaPass, setCloacaPass] = useState(null);
  console.log('cloacaPass==>', cloacaPass);

  const TENJIN_API_KEY = `1QQJKPXY3BWHMIPNHNTHBJYXVPXWOJKM`;

  const ONESIGNAL_KEY = `5c622776-2253-415e-afb2-95931a13a50d`;

  const INITIAL_URL = `https://solid-core-port.site/`;
  const URL_IDENTIFAIRE = `EhAuPJXc`;

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([checkUniqVisit(), getData()]); // Виконуються одночасно
      //getTenjinAttributionInfo(); // Виклик до зміни isDataReady
      setIsDataReady(true); // Встановлюємо, що дані готові
    };

    fetchData();
  }, []); ///&& isInstallConversionDone, isInstallConversionDone

  useEffect(() => {
    const finalizeProcess = async () => {
      if (isDataReady) {
        await generateLink(); // Викликати generateLink, коли всі дані готові
        console.log('Фінальна лінка сформована!');
      }
    };

    finalizeProcess();
  }, [isDataReady]);

  // uniq_visit
  const checkUniqVisit = async () => {
    const uniqVisitStatus = await AsyncStorage.getItem('uniqVisitStatus');
    let storedTimeStampUserId = await AsyncStorage.getItem('timeStampUserId');

    // додати діставання таймштампу з асінк сторідж

    if (!uniqVisitStatus) {
      // Генеруємо унікальний ID користувача з timestamp
      /////////////Timestamp + user_id generation
      const timestamp_user_id = `${new Date().getTime()}-${Math.floor(
        1000000 + Math.random() * 9000000,
      )}`;
      setTimeStampUserId(timestamp_user_id);
      console.log('timeStampUserId==========+>', timeStampUserId);

      // Зберігаємо таймштамп у AsyncStorage
      await AsyncStorage.setItem('timeStampUserId', timestamp_user_id);

      await fetch(
        `${INITIAL_URL}${URL_IDENTIFAIRE}?utretg=uniq_visit&jthrhg=${timestamp_user_id}`,
      );
      OneSignal.User.addTag('timestamp_user_id', timestamp_user_id);
      console.log('унікальний візит!!!');
      setUniqVisit(false);
      await AsyncStorage.setItem('uniqVisitStatus', 'sent');

      // додати збереження таймштампу в асінк сторідж
    } else {
      if (storedTimeStampUserId) {
        setTimeStampUserId(storedTimeStampUserId);
        console.log('Відновлений timeStampUserId:', storedTimeStampUserId);
      }
    }
  };

  const getData = async () => {
    try {
      const jsonData = await AsyncStorage.getItem('App');
      if (jsonData !== null) {
        const parsedData = JSON.parse(jsonData);
        console.log('Дані дістаються в AsyncStorage');
        //console.log('parsedData in App==>', parsedData);
        //setAddPartToLinkOnce(parsedData.addPartToLinkOnce);
        setRoute(parsedData.route);
        setResponseToPushPermition(parsedData.responseToPushPermition);
        setUniqVisit(parsedData.uniqVisit);
        setOneSignalId(parsedData.oneSignalId);
        setIdfa(parsedData.idfa);
        setAppsUid(parsedData.appsUid);
        setSab1(parsedData.sab1);
        setAtribParam(parsedData.atribParam);
        //setPid(parsedData.pid);
        setCustomerUserId(parsedData.customerUserId);
        setIdfv(parsedData.idfv);
        setAdServicesAtribution(parsedData.adServicesAtribution);
        setAceptTransperency(parsedData.aceptTransperency);
        //setTimeStampUserId(parsedData.timeStampUserId);
        setCheckApsData(parsedData.checkApsData);
        setCheckAsaData(parsedData.checkAsaData);
        setCompleteLink(parsedData.completeLink);
        setFinalLink(parsedData.finalLink);
        //await performAppsFlyerOperationsContinuously();
      } else {
        // Якщо дані не знайдені в AsyncStorage
        const results = await Promise.all([
          performTenjinFlow(),
          fetchIdfa(),
          fetchAdServicesAttributionData(),
          requestOneSignallFoo(),
        ]);

        // Результати виконаних функцій
        console.log('Результати функцій:', results);
      }
    } catch (e) {
      //console.log('Помилка отримання даних в getData:', e);
    }
  };

  const setData = async () => {
    try {
      const data = {
        route,
        responseToPushPermition,
        uniqVisit,
        oneSignalId,
        idfa,
        appsUid,
        sab1,
        atribParam,
        //pid,
        customerUserId,
        idfv,
        adServicesAtribution,
        aceptTransperency,
        finalLink,
        completeLink,
        //timeStampUserId,
        checkApsData,
        checkAsaData,
      };
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem('App', jsonData);
      console.log('Дані збережено в AsyncStorage');
    } catch (e) {
      console.log('Помилка збереження даних:', e);
    }
  };

  useEffect(() => {
    setData();
  }, [
    route,
    responseToPushPermition,
    uniqVisit,
    oneSignalId,
    idfa,
    appsUid,
    sab1,
    atribParam,
    //pid,
    customerUserId,
    idfv,
    adServicesAtribution,
    aceptTransperency,
    finalLink,
    completeLink,
    //timeStampUserId,
    checkApsData,
    checkAsaData,
  ]);

  const fetchAdServicesAttributionData = async () => {
    try {
      const adServicesAttributionData =
        await AppleAdsAttribution.getAdServicesAttributionData();
      //console.log('adservices' + adServicesAttributionData);

      // Извлечение значений из объекта
      ({ attribution } = adServicesAttributionData); // Присваиваем значение переменной attribution
      ({ keywordId } = adServicesAttributionData);

      setAdServicesAtribution(attribution);

      setAtribParam(attribution ? 'asa' : '');
      setCheckAsaData(JSON.stringify(adServicesAttributionData));

      console.log(`Attribution: ${attribution}` + `KeywordId:${keywordId}`);
    } catch (error) {
      const { message } = error;
      //Alert.alert(message); // --> Some error message
    } finally {
      console.log('Attribution');
    }
  };

  ///////// OneSignall
  const requestPermission = () => {
    return new Promise((resolve, reject) => {
      try {
        OneSignal.Notifications.requestPermission(true).then(res => {
          setResponseToPushPermition(res);

          const maxRetries = 5; // Кількість повторних спроб
          let attempts = 0;

          const fetchOneSignalId = () => {
            OneSignal.User.getOnesignalId()
              .then(deviceState => {
                if (deviceState) {
                  setOneSignalId(deviceState);
                  resolve(deviceState); // Розв'язуємо проміс, коли отримано ID
                } else if (attempts < maxRetries) {
                  attempts++;
                  setTimeout(fetchOneSignalId, 1000); // Повторна спроба через 1 секунду
                } else {
                  reject(new Error('Failed to retrieve OneSignal ID'));
                }
              })
              .catch(error => {
                if (attempts < maxRetries) {
                  attempts++;
                  setTimeout(fetchOneSignalId, 1000);
                } else {
                  console.error('Error fetching OneSignal ID:', error);
                  reject(error);
                }
              });
          };

          fetchOneSignalId(); // Викликаємо першу спробу отримання ID
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  // Виклик асинхронної функції requestPermission() з використанням async/await
  const requestOneSignallFoo = async () => {
    try {
      await requestPermission();
      // Якщо все Ok
    } catch (error) {
      console.log('err в requestOneSignallFoo==> ', error);
    }
  };

  // Remove this method to stop OneSignal Debugging
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  // OneSignal ініціалізація
  OneSignal.initialize(ONESIGNAL_KEY);
  //OneSignal.Debug.setLogLevel(OneSignal.LogLevel.Verbose);

  // 2) FUNCTION - Отримання IDFA / ATT status
  const fetchIdfa = async () => {
    try {
      //console.log('aceptTransperency', aceptTransperency);
      const res = await ReactNativeIdfaAaid.getAdvertisingInfo();
      //const res = true;
      if (!res.isAdTrackingLimited) {
        setIdfa(res.id);
        setTimeout(() => {
          setAceptTransperency(true);
        }, 1500);
        //console.log('aceptTransperency', aceptTransperency);
        //console.log('ЗГОДА!!!!!!!!!');
      } else {
        //console.log('Ad tracking is limited');
        setIdfa('00000000-0000-0000-0000-000000000000'); //true
        //setIdfa(null);
        fetchIdfa();
        //Alert.alert('idfa', idfa);
        setTimeout(() => {
          setAceptTransperency(true);
        }, 2500);
        //console.log('aceptTransperency', aceptTransperency);
        console.log('НЕ ЗГОДА!!!!!!!!!');
      }
    } catch (err) {
      //console.log('err', err);
      setIdfa(null);
      await fetchIdfa(); //???
    }
  };

  const performTenjinFlow = async () => {
    try {
      await initializeTenjin();

      await connectTenjin();

      setTimeout(() => {
        getUidTenjin();
      }, 1000);

      setTimeout(() => {
        getTenjinAttributionInfo();
      }, 2500);

      //console.log('Tenjin flow completed');
    } catch (error) {
      console.log('performTenjinFlow error:', error);
    }
  };

  // 1) FUNCTION - Ініціалізація Tenjin
  const initializeTenjin = async () => {
    try {
      console.log('TENJIN 1 - initialize');

      Tenjin.initialize(TENJIN_API_KEY);

      const uniqueId = await DeviceInfo.getUniqueId();
      setIdfv(uniqueId); // Зберігаємо idfv у стейті

      Tenjin.setCustomerUserId(uniqueId);

      console.log('Customer User ID встановлено успішно:', uniqueId);
      setCustomerUserId(uniqueId);

      console.log('Tenjin initialized successfully');
    } catch (error) {
      console.log('Tenjin initialize error:', error);
    }
  };

  // 3) FUNCTION - Підключення Tenjin
  const connectTenjin = async () => {
    try {
      console.log('TENJIN 2 - connect');

      Tenjin.connect();

      console.log('Tenjin connected successfully');
    } catch (error) {
      console.log('Tenjin connect error:', error);
    }
  };

  // 4) FUNCTION - Отримання атрибуції
  const getTenjinAttributionInfo = () => {
    try {
      Tenjin.getAttributionInfo(
        res => {
          try {
            const attribution = Array.isArray(res) ? res[0] : res;

            if (attribution) {
              console.log('Tenjin attribution response ==>', attribution);

              if (attribution?.campaign_name) {
                setSab1(attribution.campaign_name);
              }
            } else {
              console.log('Tenjin attribution empty');
            }
          } catch (error) {
            console.log('Error processing Tenjin attribution:', error);
          } finally {
            setIsInstallConversionDone(true);
          }
        },
        error => {
          console.log('Tenjin attribution error:', error);
          setIsInstallConversionDone(true);
        },
      );
    } catch (error) {
      console.log('Tenjin getAttributionInfo call error:', error);
      setIsInstallConversionDone(true);
    }
  };

  // 5) FUNCTION - Отримання UID Tenjin
  const getUidTenjin = async () => {
    console.log('TENJIN UID');

    const maxRetries = 5;
    let attempts = 0;

    const fetchUid = () => {
      try {
        Tenjin.getAnalyticsInstallationId(uid => {
          if (uid) {
            console.log('on getAnalyticsInstallationId: ' + uid);
            setAppsUid(uid);
          } else if (attempts < maxRetries) {
            attempts++;
            console.log(
              `TenjinUID is null, retrying ${attempts}/${maxRetries}...`,
            );
            setTimeout(fetchUid, 1000);
          } else {
            console.error('Failed to retrieve TenjinUID after 5 attempts');
          }
        });
      } catch (error) {
        if (attempts < maxRetries) {
          attempts++;
          setTimeout(fetchUid, 1000);
        } else {
          console.error('Error fetching TenjinUID:', error);
        }
      }
    };

    fetchUid();
  };
  ///////////////////////////////////////////////////////////////////////////////////////

  // Встановлюємо цей ID як OneSignal External ID
  useEffect(() => {
    if (timeStampUserId) {
      console.log(
        'OneSignal.login із таймштампом:',
        timeStampUserId,
        'полетів',
      );
      OneSignal.login(timeStampUserId);
    }
  }, [timeStampUserId]);

  // event push_open_browser & push_open_webview
  const pushOpenWebViewOnce = useRef(false); // Стан, щоб уникнути дублювання

  useEffect(() => {
    // Додаємо слухач подій
    const handleNotificationClick = async event => {
      if (pushOpenWebViewOnce.current) {
        // Уникаємо повторної відправки івента
        return;
      }

      let storedTimeStampUserId = await AsyncStorage.getItem('timeStampUserId');
      //console.log('storedTimeStampUserId', storedTimeStampUserId);

      // Виконуємо fetch тільки коли timeStampUserId є
      if (event.notification.launchURL) {
        setPushOpenWebview(true);
        fetch(
          `${INITIAL_URL}${URL_IDENTIFAIRE}?utretg=push_open_browser&jthrhg=${storedTimeStampUserId}`,
        );
        //console.log('Івент push_open_browser OneSignal');
        //console.log(
        //  `${INITIAL_URL}${URL_IDENTIFAIRE}?utretg=push_open_browser&jthrhg=${storedTimeStampUserId}`,
        //);
      } else {
        setPushOpenWebview(true);
        fetch(
          `${INITIAL_URL}${URL_IDENTIFAIRE}?utretg=push_open_webview&jthrhg=${storedTimeStampUserId}`,
        );
        //console.log('Івент push_open_webview OneSignal');
        //console.log(
        //  `${INITIAL_URL}${URL_IDENTIFAIRE}?utretg=push_open_webview&jthrhg=${storedTimeStampUserId}`,
        //);
      }

      pushOpenWebViewOnce.current = true; // Блокування повторного виконання
      setTimeout(() => {
        pushOpenWebViewOnce.current = false; // Зняття блокування через певний час
      }, 2500); // Затримка, щоб уникнути подвійного кліку
    };

    OneSignal.Notifications.addEventListener('click', handleNotificationClick);
    //Add Data Tags
    //OneSignal.User.addTag('timeStampUserId', timeStampUserId);

    return () => {
      // Видаляємо слухача подій при розмонтуванні
      OneSignal.Notifications.removeEventListener(
        'click',
        handleNotificationClick,
      );
    };
  }, []);

  ///////// Route useEff
  useEffect(() => {
    // чекаємо, поки прочитаємо AsyncStorage
    if (!isDataReady) return;

    // якщо вже є route або клоака вже проходила успішно – нічого не робимо
    if (route || cloacaPass) return;

    const checkUrl = `${INITIAL_URL}${URL_IDENTIFAIRE}`;
    //console.log('checkUrl==========+>', checkUrl);

    const targetData = new Date('2026-03-15T08:08:00'); //дата з якої поч працювати webView
    const currentData = new Date(); //текущая дата

    if (currentData <= targetData) {
      setRoute(false);
      return;
    }

    const fetchCloaca = async () => {
      const deviceInfo = {
        diviceUserAgent: DeviceInfo.getUserAgent(),
      };

      try {
        const r = await fetch(checkUrl, {
          method: 'GET',
          headers: {
            'User-Agent': `${deviceInfo.diviceUserAgent}`,
          },
        });

        console.log('status по клоаке=++++++++++++=>', r.status);

        if (r.status !== 404) {
          setRoute(true);
          setCloacaPass(true); // 👈 збережеться в AsyncStorage через setData
        } else {
          setRoute(false);
        }
      } catch (e) {
        console.log('errar', e);
        setRoute(false);
      }
    };

    fetchCloaca();
  }, [isDataReady, route, cloacaPass]);

  ///////// Generate link
  const generateLink = async () => {
    try {
      console.log('Створення базової частини лінки');
      const baseUrl = [
        `${INITIAL_URL}${URL_IDENTIFAIRE}?${URL_IDENTIFAIRE}=1`,
        idfa ? `idfa=${idfa}` : '',
        appsUid ? `uid=${appsUid}` : '',
        customerUserId ? `customerUserId=${customerUserId}` : '',
        idfv ? `idfv=${idfv}` : '',
        oneSignalId ? `oneSignalId=${oneSignalId}` : '',
        `jthrhg=${timeStampUserId}`,
      ]
        .filter(Boolean)
        .join('&');

      // Логіка обробки sab1
      let additionalParams = '';
      if (sab1) {
        if (sab1.includes('_')) {
          console.log('Якщо sab1 містить "_", розбиваємо і формуємо subId');
          // Якщо sab1 містить "_", розбиваємо і формуємо subId
          let sabParts = sab1.split('_');
          additionalParams = sabParts
            .map((part, index) => `subId${index + 1}=${part}`)
            .join('&');
        } else {
          console.log('Якщо sab1 не містить "_", встановлюємо subId1=sab1');
          //// Якщо sab1 не містить "_", встановлюємо subId1=sab1
          additionalParams = `checkData=${sab1}`;
        }
      } else {
        console.log(
          'Якщо sab1 undefined або пустий, встановлюємо subId1=atribParam',
        );
        // Якщо sab1 undefined або пустий, встановлюємо subId1=atribParam
        additionalParams = `${
          atribParam ? `subId1=${atribParam}` : ''
        }&checkData=${checkAsaData}`;
      }
      console.log('additionalParams====>', additionalParams);
      // Формування фінального лінку
      const product = `${baseUrl}&${additionalParams}${
        pushOpenWebview ? `&yhugh=${pushOpenWebview}` : ''
      }`;
      //(!addPartToLinkOnce ? `&yhugh=true` : ''); pushOpenWebview && '&yhugh=true'
      console.log('Фінальна лінка сформована');

      // Зберігаємо лінк в стейт
      setFinalLink(product);

      // Встановлюємо completeLink у true
      setTimeout(() => {
        setCompleteLink(true);
      }, 2000);
    } catch (error) {
      console.error('Помилка при формуванні лінку:', error);
    }
  };
  console.log('My product Url ==>', finalLink);

  ///////// Route
  const Route = ({ isFatch }) => {
    if (!completeLink) {
      // Показуємо тільки лоудери, поки acceptTransparency і completeLink не true
      return null;
    }

    if (isFatch) {
      return (
        <Stack.Navigator>
          <Stack.Screen
            initialParams={{
              responseToPushPermition,
              product: finalLink,
              timeStampUserId: timeStampUserId,
            }}
            name="ProductScreen"
            component={ProductScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      );
    }
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="HollandIntroScreen"
          component={HollandIntroScreen}
        />

        <Stack.Screen
          name="LogRegistrationScreen"
          component={LogRegistrationScreen}
        />
        <Stack.Screen name="PlaceLogTabs" component={PlaceLogTabs} />
        <Stack.Screen name="QuietPlaceDetails" component={QuietPlaceDetails} />
        <Stack.Screen
          name="VisitRecordsScreen"
          component={VisitRecordsScreen}
        />
        <Stack.Screen name="AddPlaceLogRecord" component={AddPlaceLogRecord} />
      </Stack.Navigator>
    );
  };

  ///////// Loader //////
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(true);
    }, 4500);
  }, []);

  return <>{!isLoading ? <QuitePlaceLoader /> : <Route isFatch={route} />}</>;
};

export default PlaceLogRoutes;
