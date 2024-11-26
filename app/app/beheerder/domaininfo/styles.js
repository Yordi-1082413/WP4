import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
  },

  pageContainer: {
    flex: 1,
    width: '80%',
    paddingTop: 20,
    zIndex: 0,
  },

  // navbar
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    paddingHorizontal: 10,
    backgroundColor: '#2d2d2d',
    borderRadius: 15,
    marginTop: 20,
    padding: 5,
  },

  backButton: {
    padding: 10,
  },

  // zoeken opties
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchInput: {
    backgroundColor: '#4f4f4f',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: 300,
    marginRight: 40,
  },

  // pagina secties
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },

  section: {
    backgroundColor: '#2d2d2d',
    width: '49%',
    padding: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  sectionTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
    marginLeft: 10,
  },

  sectionText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    maxWidth: '100%',
  },

  // domein gegevens tabel

  noDomainText: {
    color: '#fff',
  },

  scrollView: {
    flex: 1,
    width: '100%',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },

  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    width: '20%',
    textAlign: 'center',
  },

  domainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },

  domainText: {
    color: '#fff',
    width: '20%',
    textAlign: 'center',
  },

  viewButton: {
    backgroundColor: '#a336c1',
    padding: 10,
    borderRadius: 5,
    width: '20%',
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#fff',
  },

  // modal venster
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  overlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
  },

  modalView: {
    position: 'absolute',
    width: '80%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  name: {
    fontSize: 18,
    marginBottom: 5,
  },
  email: {
    fontSize: 18,
    marginBottom: 5,
  },
  role: {
    fontSize: 18,
    marginBottom: 5,
  },

  // bewerken van

  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  editButton: {
    backgroundColor: '#009688',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 20,
    flex: 1,
    marginRight: 10,
  },

  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  saveButton: {
    backgroundColor: '#009688',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 20,
    flex: 1,
  },

  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  closeButton: {
    backgroundColor: '#a336c1',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 20,
    flex: 1,
  },

  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // succes bericht
  successMessage: {
    color: 'green',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default styles