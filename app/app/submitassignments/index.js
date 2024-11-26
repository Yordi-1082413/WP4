import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';

const SubmitAssignments = () => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    const [module, setModule] = useState([]);
    const router = useRouter();
    const params = useLocalSearchParams();
    const { SubjectId } = params;

    const parameters = new URLSearchParams({
        SubjectId: SubjectId,
    });

    useEffect(() => {
        getModule();
    }, []);

    const deleteFile = async () => {
        const formData = new FormData();
        formData.append('subjectid', SubjectId);

        try {
            const uploadResponse = await fetch(`${API_URL}/submitassignment/deletesubmit/`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });
            getModule();
            documentName(null);
            if (!uploadResponse.ok) {
                throw new Error('Failed to upload image');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const getModule = async () => {
        try {
            const response = await fetch(`${API_URL}/modules/getmodule?` + parameters, {
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
            setModule(data);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        }
    };

    console.log(module)

    const [selectedDocument, setSelectedDocument] = useState(null);
    const [documentname, documentName] = useState(null);
    const pickDocument = async () => {
        let result = await DocumentPicker.getDocumentAsync({
            type: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'],
            copyToCacheDirectory: true,
        });        

        if (!result.cancelled) {
            console.log(result)
            setSelectedDocument(result)
            const selectedAsset = result.assets[0];
            documentName(selectedAsset.name)
        }
    };

    const handleUpload = () => {
        if (selectedDocument) {
            uploadDocument(selectedDocument);
        } else {
            Alert.alert('No document selected');
        }
    }
    //Kut file formats tering ding  X_X
    const uploadDocument = async (selectedDocument) => {
        if (!selectedDocument.canceled && selectedDocument.assets && selectedDocument.assets.length > 0) {
            const selectedAsset = selectedDocument.assets[0];
            const response = await fetch(selectedAsset.uri);
            const blob = await response.blob();
            console.log(blob)

            const formData = new FormData();
            formData.append('file', blob, selectedAsset.name || 'document.docx');
            formData.append('subjectid', SubjectId);

            try {
                const uploadResponse = await fetch(`${API_URL}/submitassignment/submit/`, {
                    method: 'POST',
                    body: formData,
                    credentials: 'include',
                });

                if (!uploadResponse.ok) {
                    throw new Error('Failed to upload image');
                }
                getModule();
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.wrapper}>
                <View style={styles.container}>
                    <View style={styles.submitcontainer}>
                        {module.length !== 0 ? (
                            <View>
                                {module.map((item, index) => (
                                    <View style={{ marginTop: '10%' }} key={index}>
                                        {item[4] ? (
                                            <Text style={styles.textinfo}>
                                                <Text style={{ fontWeight: '700', color: '#a336c1' }}>Opdracht is al ingeleverd met deze file:</Text> {item[4]}
                                            </Text>
                                        ) : null}
                                        {item[4] ? (
                                            <View>
                                                <Text style={styles.textinfo}>Bestand verwijderen klik op de knop beneden!</Text>
                                                <Pressable style={styles.deleteButton} onPress={deleteFile}>
                                                    <Text style={styles.deleteButtonText}>Verwijderen!</Text>
                                                </Pressable>
                                            </View>
                                        ) : null}
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <View>
                                <Text style={styles.texttitel}>Lever hier jouw opdracht in!!</Text>
                                <Pressable style={styles.pickDocument} onPress={pickDocument}>
                                    <FontAwesomeIcon icon={faFileUpload} style={styles.icon} size={20} />
                                    <Text style={styles.submittextfile}>Kies bestand!</Text>
                                </Pressable>
                                <View>
                                    <Text style={styles.textinfo}>
                                        <Text style={{ fontWeight: '700', color: '#a336c1' }}>Gekozen bestand: </Text> {documentname && <Text style={{ color: 'white' }}> {documentname}</Text>}
                                    </Text>
                                </View>
                                <Pressable style={styles.uploadButton} onPress={handleUpload}>
                                    <Text style={styles.uploadButtonText}>Inleveren!</Text>
                                </Pressable>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

export default SubmitAssignments;

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#181818',
    },
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#181818',
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        width: '100%',
        margin: 'auto',
        
    },
    submitcontainer: {
        backgroundColor: '#282828',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 20,
    },
    texttitel: {
        color: '#a336c1',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    textinfo: {
        color: '#FFFFFF',
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    uploadButton: {
        backgroundColor: '#a336c1',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    uploadButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    pickDocument: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        justifyContent: 'center',
        marginBottom: 10,
    },
    submittextfile: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginLeft: 10,
    },
    deleteButton: {
        backgroundColor: '#ff4d4d',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    deleteButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    icon: {
        color: '#FFFFFF',
    },
});
