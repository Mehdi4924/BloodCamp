// import React, {useState, useEffect} from 'react';
// import {Text, View, StyleSheet, Button, TouchableOpacity} from 'react-native';
// import {BarCodeScanner} from 'expo-barcode-scanner';
// import {hp, wp} from '../Constants/Responsive';
// import Colors from '../Constants/Colors';
// import {Icon} from '@rneui/base';

// export default function BarCodeComponent(props) {
//   const prevData = props.prevBarCode;
//   const [scanned, setScanned] = useState(prevData ? true : false);
//   const [data, setData] = useState(prevData || '');
//   const [hasPermission, setHasPermission] = useState(null);

//   useEffect(() => {
//     const getBarCodeScannerPermissions = async () => {
//       const {status} = await BarCodeScanner.requestPermissionsAsync();
//       setHasPermission(status === 'granted');
//     };
//     getBarCodeScannerPermissions();
//   }, []);

//   const handleBarCodeScanned = ({type, data}) => {
//     setScanned(true);
//     setData(data);
//     props.onScan(data);
//   };

//   if (hasPermission === null) {
//     return (
//       <Text style={styles.requestingText}>
//         Requesting for camera permission ...
//       </Text>
//     );
//   }
//   if (hasPermission === false) {
//     return (
//       <Text style={styles.requestingText}>
//         No access to camera given, Please give access first.
//       </Text>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {scanned ? (
//         <>
//           <Text style={styles.barCodeInfo}>Barcode Info: {data}</Text>
//           <TouchableOpacity
//             style={styles.scannedBarCode}
//             onPress={() => setScanned(false)}>
//             <Text style={{color: Colors.white}}>Scan Again</Text>
//             <Icon
//               name="barcode-scan"
//               type="material-community"
//               size={hp(3)}
//               color={Colors.primary}
//             />
//           </TouchableOpacity>
//         </>
//       ) : (
//         <BarCodeScanner
//           onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//           style={{
//             position: 'absolute',
//             right: 0,
//             left: 0,
//             top: 0,
//             bottom: hp(10),
//           }}
//         />
//       )}
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   container: {flex: 1},
//   barCodeInfo: {
//     backgroundColor: Colors.lightGrey,
//     color: Colors.black,
//     alignSelf: 'center',
//     paddingVertical: hp(1),
//     paddingHorizontal: wp(4),
//     marginVertical: hp(1),
//     textAlignVertical: 'center',
//     textAlign: 'center',
//     fontSize: hp(2),
//     fontWeight: 'bold',
//   },
//   requestingText: {
//     backgroundColor: Colors.primary,
//     width: wp(90),
//     alignSelf: 'center',
//     paddingVertical: hp(1),
//     textAlignVertical: 'center',
//     textAlign: 'center',
//     color: Colors.white,
//     fontSize: hp(2),
//     fontWeight: 'bold',
//   },
//   scannedBarCode: {
//     backgroundColor: Colors.black,
//     width: wp(50),
//     alignSelf: 'center',
//     paddingVertical: hp(1),
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderRadius: 5,
//     paddingHorizontal: wp(5),
//   },
// });
import React, {useState, useEffect, useRef} from 'react';
import {Text, View, StyleSheet, Button, TouchableOpacity} from 'react-native';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import {hp, wp} from '../Constants/Responsive';
import {Icon} from '@rneui/base';
export default function BarCodeComponent(props) {
  const prevData = props.prevBarCode;
  const [scanned, setScanned] = useState(prevData ? true : false);
  const [data, setData] = useState(prevData || '');
  const camerRef = useRef(null);
  function onBarCodeRead(e) {
    console.log('==>>', e);
    setData(e.data);
    setScanned(true);
    props.onScan(e.data);
  }
  return (
    <View style={{flex: 1}}>
      {scanned ? (
        <>
          <Text style={styles.barCodeInfo}>Barcode Info: {data}</Text>
          <TouchableOpacity
            style={styles.scannedBarCode}
            onPress={() => setScanned(false)}>
            <Text style={{color: Colors.white}}>Scan Again</Text>
            <Icon
              name="barcode-scan"
              type="material-community"
              size={hp(3)}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </>
      ) : (
        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          onBarCodeRead={onBarCodeRead}>
          <BarcodeMask outerMaskOpacity={0.8} width={wp(90)} height={hp(60)} />
        </RNCamera>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  preview: {
    width: wp(100),
    height: hp(65),
  },
  barCodeInfo: {
    backgroundColor: Colors.lightGrey,
    color: Colors.black,
    alignSelf: 'center',
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    marginVertical: hp(1),
    textAlignVertical: 'center',
    textAlign: 'center',
    fontSize: hp(2),
    fontWeight: 'bold',
  },
  requestingText: {
    backgroundColor: Colors.primary,
    width: wp(90),
    alignSelf: 'center',
    paddingVertical: hp(1),
    textAlignVertical: 'center',
    textAlign: 'center',
    color: Colors.white,
    fontSize: hp(2),
    fontWeight: 'bold',
  },
  scannedBarCode: {
    backgroundColor: Colors.black,
    width: wp(50),
    alignSelf: 'center',
    paddingVertical: hp(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: wp(5),
  },
});
