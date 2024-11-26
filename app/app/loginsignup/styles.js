import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121212',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  text: {
    color: '#a336c1',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  underline: {
    width: 60,
    height: 4,
    backgroundColor: '#a336c1',
    borderRadius: 2,
  },
  inputs: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#282828',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
    color: '#ccc',
  },
  inputField: {
    flex: 1,
    color: '#ccc',
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#ccc',
    fontSize: 16,
  },
  clickHere: {
    color: '#a336c1',
  },
  submitContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  submit: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a336c1',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 20,
  },
  submitText: {
    color: '#ccc',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gray: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282828',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 10,
  },
  grayText: {
    color: '#ccc',
    fontSize: 18,
    fontWeight: 'bold',
  },
});