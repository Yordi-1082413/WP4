//unused
import { StyleSheet, Dimensions,  } from 'react-native';
const windowWidth = Dimensions.get('window').width
console.log(windowWidth)

export default StyleSheet.create({
    container: {
        margin: 'auto',
        marginTop: '30px',
        width: (windowWidth > 1000) ? '80%' : '100%',
        height: '100vh',
        paddingBottom: '30px',
        
    },

    wrapper: {
        height: '100vh',
        overflow: 'scroll',
        backgroundColor: '#121212',
    },

    submitcontainer: {
        flexDirection: 'column',
        margin: 'auto',
        marginTop: '30px',
        width: (windowWidth > 1000) ? '60%' : '90%',
        paddingBottom: '30px',
        backgroundColor: '#282828',
        minHeight: '60%',
        boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px',
    },

    texttitel: {
        color: '#a336c1',
        fontSize: '17px',
        padding: '5%',
        paddingBottom: '1%',
        fontWeight: '700',
    },

    textinfo: {
        color: 'white',
        fontSize: '15px',
        paddingLeft: '5%',
        paddingBottom: '10%',
        paddingTop: '2%',
        paddingBottom: '1%',
        fontWeight: '700',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        marginLeft: '5%',
        marginBottom: '0%',
        marginTop: '5%',
        width: '40%',
        backgroundColor: '#a336c1',
      },
      submittext: {
        fontSize: 15,
        lineHeight: 21,
        fontWeight: '700',
        letterSpacing: 0.25,
        color: 'white',
      },
      pickDocument: {
        paddingLeft: '5%',
        paddingBottom: '10%',
        paddingTop: '2%',
        paddingBottom: '1%',
      },
      submittextfile: {
        fontSize: 15,
        lineHeight: 21,
        fontWeight: '700',
        letterSpacing: 0.25,
        color: '#a336c1',
        textDecorationLine: 'underline',
      },

      deleteButton: {
        backgroundColor: '#ff4d4d',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        elevation: 3,
        width: "40%",
        marginTop: "30px",
        marginLeft: '5%',
      },
      deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
      },

});