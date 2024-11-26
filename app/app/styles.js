import { StyleSheet } from 'react-native';

export default StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#121212',
    },
    header: {
      fontSize: 35,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 20,
      color: '#fff',
    },
    headerSpan: {
      color: '#a336c1',
    },
    text: {
      fontSize: 25,
      color: '#b3b3b3',
      textAlign: 'center',
    },
    loginsignupbutton: {
      marginTop: '4%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      width: 220,
      height: 59,
      color: '#fff',
      backgroundColor: '#a336c1',
      borderRadius: 50,
      fontSize: 19,
      fontWeight: '700',
    },
    image: {
      width: 200,
      height: 200,
      marginBottom: 20,
    },
});
