import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendarDays, faHippo } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocalSearchParams } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const Modulen = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [modules, setModules] = useState([]);

    const params = useLocalSearchParams();
    const { VakId } = params;
    const router = useRouter();
    const parameters = new URLSearchParams({
        VakId: VakId,
    });

    useEffect(() => {
        fetchUserInfo();
        getModulen();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const response = await fetch(`${API_URL}/api/profile/userinfo`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setUserInfo(data.userinfo);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        }
    };

    const getModulen = async () => {
        try {
            const response = await fetch(`${API_URL}/modules/getmodules?` + parameters, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setModules(data);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        }
    };

    const handleQuizButtonPress = () => {
        router.push(`/games?gameId=${VakId}`);
    };

    const handleInleverenButtonPress = (subjectId) => {
        router.push({ pathname: "submitassignments", params: { SubjectId: subjectId } });
    };

    return (
        <ScrollView style={styles.wrapper}>
            <View style={styles.container}>
                <View style={styles.modulecontainer}>
                    <View style={styles.moduletitelcontainer}>
                        <Text style={styles.moduletitel}>Modules!</Text>
                        <FontAwesomeIcon icon={faCalendarDays} style={styles.titelicon} size={40} />
                    </View>
                    {modules.map((item, index) => (
                        <View key={item[0]} style={styles.module}>
                            <Link href={{ pathname: "submitassignments", params: { SubjectId: item[0] } }}>
                                <View style={{ width: '100%', flexDirection: "row", alignItems: 'center' }}>
                                    <View style={{ flex: 3 }}>
                                        <Text style={styles.titel}>{item[1]}</Text>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'center' }}>
                                        <FontAwesomeIcon icon={faHippo} style={styles.icon} size={40} />
                                    </View>
                                </View>
                                {item[3] === 'Voltooid' ? (
                                    <View style={styles.loadingbar}>
                                        <Text style={styles.loadingbargreen}>Voltooid</Text>
                                    </View>
                                ) : item[3] === null ? (
                                    <View style={styles.loadingbar}>
                                        <Text style={styles.loadingbarred}>Onvoltooid</Text>
                                    </View>
                                ) : item[3] === 'Ingeleverd' ? (
                                    <View style={styles.loadingbar}>
                                        <Text style={styles.loadingbargray}>Ingeleverd</Text>
                                    </View>
                                ) : (
                                    <View style={styles.loadingbar}>
                                        <Text style={styles.loadingbarred}>Onvoltooid</Text>
                                    </View>
                                )}
                            </Link>
                            <Pressable style={styles.inleverenButton} onPress={() => handleInleverenButtonPress(item[0])}>
                                <Text style={styles.inleverenButtonText}>Inleveren</Text>
                            </Pressable>
                            <Pressable style={styles.quizButton} onPress={handleQuizButtonPress}>
                                <Text style={styles.quizButtonText}>Ga naar vak quiz</Text>
                            </Pressable>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

export default Modulen;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#121212',
    },
    container: {
        margin: 'auto',
        marginTop: 30,
        width: width > 768 ? '70%' : '90%',
        paddingBottom: 30,
    },
    modulecontainer: {
        flexDirection: width > 768 ? 'row' : 'column',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        margin: 'auto',
        marginTop: 30,
        width: '100%',
        paddingBottom: 30,
        boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px',
    },
    moduletitelcontainer: {
        flexDirection: 'row',
        boxShadow: 'rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px',
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 10,
        backgroundColor: '#282828',
        marginLeft: '1%',
        height: 60,
        width: '98%',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    moduletitel: {
        color: '#a336c1',
        fontSize: 20,
        fontWeight: '700',
        flex: 3,
    },
    titelicon: {
        flex: 1,
        color: '#a336c1',
        textAlign: 'right',
    },
    module: {
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 10,
        backgroundColor: '#282828',
        flex: 1,
        marginTop: 20,
        padding: 15,
        width: width > 768 ? '48%' : '100%',
        boxShadow: 'rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px',
    },
    icon: {
        color: '#a336c1',
    },
    titel: {
        color: '#a336c1',
        fontSize: 18,
        fontWeight: '700',
    },
    loadingbar: {
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 5,
        width: '50%',
        marginLeft: '25%',
        marginTop: 20,
        alignSelf: 'center',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingbargreen: {
        lineHeight: 26,
        height: 26,
        width: '100%',
        backgroundColor: 'green',
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        borderRadius: 5,
    },
    loadingbarred: {
        lineHeight: 26,
        height: 26,
        width: '100%',
        backgroundColor: 'red',
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        borderRadius: 5,
    },
    loadingbargray: {
        lineHeight: 26,
        height: 26,
        width: '100%',
        backgroundColor: 'gray',
        textAlign: 'center',
        color: 'white',
        fontSize: 16,
        borderRadius: 5,
    },
    inleverenButton: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    inleverenButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    quizButton: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#a336c1',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    quizButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
