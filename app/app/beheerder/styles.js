import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
  },

  dashboardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '80%',
    paddingTop: 20,
    zIndex: 0,
  },

  secondaryNavbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#2d2d2d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    zIndex: 2,
  },

  //side panel 
  sidePanelButton: {
    fontSize: 24,
    color: '#fff',
  },

  sidePanel: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: '#1E1E1E',
    paddingVertical: 20,
    paddingHorizontal: 10,
    zIndex: 1,
    alignItems: 'flex-start',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 0,  
    borderBottomRightRadius: 0, 
    borderBottomLeftRadius: 0
  },

  logo: {
    width: 50,
    height: 50,
    marginBottom: 20,
  },

  closeSidePanelButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },

  closeSidePanelButton: {
    color: '#fff',
    fontSize: 20,
  },

  sidePanelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },

  sidePanelItemText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },

  // boven sectie
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '103%',
    marginBottom: 20,
    padding: 20,
    borderRadius: 8,
  },

  //Left sectie
  leftSectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '49%',
    marginBottom: 20,
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 8,
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  leftSectiontxt: {
    fontSize: 16,
    color: '#ffff',
  },

  leftSectionAdminDashboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#a336c1',
    textAlign: 'right',
    marginLeft: 400, 
    alignItems: 'flex-start'
  },

  // right sectie
  rightSectionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '49%',
    marginBottom: 20,
    padding: 20,
    borderRadius: 8,
    paddingBottom: '1%',
    flexwrap: 'wrap',
  },

  rightSectionRButton: {
    backgroundColor: '#a336c1',
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 8,
    marginLeft: 20,
    marginRight: 0,
    width: '40%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 90,
    flexDirection: 'row',
  },

  rightSectionLButton: {
    backgroundColor: '#009688',
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 8,
    marginLeft: 20,
    marginRight: 0,
    width: '40%',
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 70,
    flexDirection: 'row',
  },

  rightSectionButtonText: {
    color: '#fff',
    fontSize: 24,
    marginLeft: 10,
  },

  //dashboard bovenste deel  
  dashboardSectionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  // dashboard vakken
  dashboardSection: {
    backgroundColor: '#2d2d2d',
    width: '24%',
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'flex-start', 
    justifyContent: 'center',
    height: 140,
  },

  dashboardSectionTitle: {
    fontSize: 18, 
    marginBottom: 10,
    textAlign: 'left',
    fontWeight: 'bold',
    color: '#fff',
  },

  dashboardSectionCount: {
    fontSize: 28,
    marginTop: 5,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#fff',
  },

  dashboardSectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  iconRight: {
    marginLeft: 'auto',
    fontSize: 70,
  },

  sectionContainerMarginTop: {
    marginTop: -30,
  },

  dashboardSectionsContainerMarginTop: {
    marginTop: -50,
  },

  //mid sectie

  midSectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
    borderRadius: 8,
  },
  
  midLeftSection: {
    backgroundColor: '#2d2d2d',
    width: '49%',
    padding: 20,
    borderRadius: 8,
    alignItems: 'flex-start',
    
  },
  
  midRightSection: {
    backgroundColor: '#2d2d2d',
    width: '49%',
    padding: 20,
    borderRadius: 8,
    alignItems: 'flex-start',
    textAlign: 'right',
  },
  
  midSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },

  midSectionButton: {
    backgroundColor: '#a336c1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  
  midSectionButtonText: {
    fontSize: 16,
    color: '#fff', 
    marginLeft: 10,
  },

  // recente gebeurtenissen (mird right section)
  recentEventsTable: {
    marginTop: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#a336c1',
    borderRadius: 8,
  },
  
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,

    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  
  tableHeaderItem: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    paddingVertical: 10,
  },
  
  recentEventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#a336c1',
    backgroundColor: '#2d2d2d',
  },
  
  recentEventAction: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    padding: 10,
  },
  
  recentEventTime: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    padding: 10,
    textAlign: 'right',
  },


});
