//unused

import { StyleSheet, Dimensions,  } from 'react-native';
const windowWidth = Dimensions.get('window').width
console.log(windowWidth)

export default StyleSheet.create({
    container: {
        margin: 'auto',
        marginTop: '30px',
        width: '80%',
        height: '100vh',
        paddingBottom: '30px',
        
    },
    bannerWrapper: {
        height: (windowWidth > 1000) ? 200 : 0,
        width: (windowWidth > 1000) ? '90%' : 0,
        margin: 'auto',
    },
    banner: {
        width: "99%",
        height: "100%",
        margin: 'auto',
        resizeMode: "cover",
        display: (windowWidth > 1000) ? 'inline-block' : 'none',
    },
    domaincontainer: {
        flexDirection: (windowWidth > 1000) ? 'row' : 'column',
        flexWrap:  'wrap',
        margin: 'auto',
        marginTop: '30px',
        width: '90%',
        paddingBottom: '30px',
        boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px',
        //boxShadow: (windowWidth > 1000) ? 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px' : 'none', 
     },
     domaintitelcontainer: {
        flexDirection: 'row',
        boxShadow: 'rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px',
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 0,
        backgroundColor: '#282828',
        marginLeft: '1%',
        height: '60px',
        width: (windowWidth > 1000) ? '98%' : '100%',
     },
     domaintitel: {
        marginLeft:(windowWidth > 1000) ? '1%' : '5%',
        display: 'flex',
        marginTop: 'auto',
        marginBottom: 'auto',
        color: '#a336c1',
        fontSize: '17px',
        fontWeight: '700',
        flex: 3
     },
     titelicon: {
        flex: (windowWidth > 1000) ? 0.5 : 1,
        display: 'flex',
        marginLeft: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
        color: '#a336c1',
     },
    domain: {
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 0,
        backgroundColor: '#282828',
        flex: 1,
        marginTop: '30px',
        minWidth: (windowWidth > 1000) ? '32%' : '100%',
        maxWidth: (windowWidth > 1000) ? '32%' : '100%',
        minHeight: (windowWidth > 1000) ? '100px' : '100px',
        maxHeight: (windowWidth > 1000) ? '100px' : '100px',
        marginLeft: '1%',
        boxShadow: 'rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px',
        //boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
    },
    icon: {
        marginTop: '25%',
        color: '#a336c1',
        fontSize: '50px',
    },
    titel: {
        color: '#a336c1',
        fontSize: '17px',
        padding: '5%',
        paddingBottom: '1%',
        fontWeight: '700',
    },
    text: {
        color: 'white',
        fontSize: '16px',
        padding: '5%',
        paddingTop: '1%',
    },
    wrapper: {
        height: '100vh',
        overflow: 'scroll',
        backgroundColor: '#121212',
    },
    inputLabels: {
        fontSize: 16,
        color: '#000000',
        marginBottom: 7,
    },
    inputField: {
        backgroundColor: '#EEEEEE',
        padding: 10,
        color: '#505050',
        height: 50
    },
    inputWrapper: {
        paddingBottom: 20,
    },
    popup: {
        position: 'absolute',
        left: (windowWidth > 1000) ? '25%' : '0%',
        right: '25%',
        top: '10%',
        minHeight: '40%',
        maxHeight: '40%',
        minWidth: (windowWidth > 1000) ? '40%' : '90%',
        maxWidth: (windowWidth > 1000) ? '40%' : '90%',
        boxShadow: 'rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px',
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 0,
        backgroundColor: '#282828',
    },
    popupback: {
        position: 'absolute',
        top: 1,
        right: 3,
    },
    popupinfo: {
        height: '300px',
        width: '100%',
    },
    submitButton: {
        marginTop: '20px',
        marginLeft: '20px',
        width:  (windowWidth > 1000) ? '30%' : '50%',
        height: '40px',
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 10,
        backgroundColor: '#a336c1',
    },
    picker: {
        width: '300px',
        marginLeft: '20px',
    }
  });



    
        
  

