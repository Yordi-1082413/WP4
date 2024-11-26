import React, { useState, useEffect } from 'react';
import { View, Text, Image, Pressable, StyleSheet, ScrollView, ActivityIndicator, TextInput, Platform  } from 'react-native';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import * as Animatable from 'react-native-animatable';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faEnvelope, faEdit, } from '@fortawesome/free-solid-svg-icons';
import Constants from 'expo-constants';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const UserInfoPage = () => {
    const [userInfo, setUserInfo] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editingUsername, setEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

    const router = useRouter();

    useEffect(() => {
        fetchUserInfo();
        requestMediaLibraryPermissions();
        requestNotificationsPermissions();
    }, []);

    const requestMediaLibraryPermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }
    };


// Notifications permission request
const requestNotificationsPermissions = async () => {
    // Check if the platform is iOS or Android
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
       const { status } = await Notifications.requestPermissionsAsync({
         ios: {
           allowAlert: true,
           allowBadge: true,
           allowSound: true,
         },
       });
       if (status !== 'granted') {
         alert('Failed to get push token for push notification!');
         return;
       }
   
       // Get the Expo push token with the projectId
       const tokenResponse = await Notifications.getExpoPushTokenAsync({
         projectId: Constants.expoConfig.extra.eas.projectId,
       });
       const expoPushToken = tokenResponse.data;
   
       // Send the token to backend
       try {
         const response = await fetch(`${API_URL}/api/profile/update-push-token`, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           credentials: 'include',
           body: JSON.stringify({ expoPushToken }),
         });
   
         if (!response.ok) {
           throw new Error('Failed to update push token');
         }
       } catch (error) {
         console.error('Error updating push token:', error);
       }
    }
   };
    


    //Fetches the user profile info
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
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="purple" />;
    }

    //Handles new uploading of profile picture
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,

        });

        if (!result.cancelled) {
            console.log(result)
            uploadProfilePicture(result);
        }
    };


    //Kut file formats tering ding  X_X
    const uploadProfilePicture = async (imagePickerResult) => {
        if (!imagePickerResult.canceled && imagePickerResult.assets && imagePickerResult.assets.length > 0) {
            const selectedAsset = imagePickerResult.assets[0];

            try {
                const response = await fetch(selectedAsset.uri);
                const blob = await response.blob();

                const formData = new FormData();
                formData.append('file', blob, selectedAsset.fileName || 'image.jpg');

                const uploadResponse = await fetch(`${API_URL}/api/profile/upload-avatar/`, {
                    method: 'POST',
                    body: formData,
                    credentials: 'include',
                });

                if (!uploadResponse.ok) {
                    throw new Error('Failed to upload image');
                }

                const data = await uploadResponse.json();
                setUserInfo((prevState) =>
                    prevState.map((user) => ({
                        ...user,
                        avatarUrl: data.filename,
                    }))
                );
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };



    //Username handling
    const handleUsernameClick = () => {
        setEditingUsername(true);
        setNewUsername(userInfo[0].GebruikersNaam);
    };

    const updateUsername = async () => {
        try {
            const response = await fetch(`${API_URL}/api/profile/update-username`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUsername),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to update username');
            }

            setUserInfo((prevState) =>
                prevState.map((user) => ({
                    ...user,
                    GebruikersNaam: newUsername,
                }))
            );
            setEditingUsername(false);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    //Password changing handeling
    const showUpdatePasswordPrompt = () => {
        setShowPasswordPrompt(true);
    };

    const updatePassword = async () => {
        try {
            const response = await fetch(`${API_URL}/api/profile/update-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to update password');
            }

            setCurrentPassword('');
            setNewPassword('');
            setShowPasswordPrompt(false);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            router.push('/loginsignup');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
            <View style={styles.container}>
                <Animatable.View
                    animation="pulse"
                    duration={600}
                    style={styles.contentContainer}
                >
                    <ScrollView contentContainerStyle={styles.container}>
                        {userInfo.map((user, index) => (
                            <View key={index} style={styles.card}>
                                <View style={styles.avatarContainer}>
                                    <Pressable onPress={pickImage}>
                                        <Image
                                            source={
                                                user.avatarUrl && user.avatarUrl !== 'none'
                                                    ? { uri: `${API_URL}/api/profile/images/${user.avatarUrl}` }
                                                    : require('../../assets/astronessie.png')
                                            }
                                            style={styles.avatar}
                                        />
                                    </Pressable>
                                    <Pressable style={styles.editIconContainer} onPress={pickImage}>
                                        <FontAwesomeIcon icon={faEdit} size={24} color="white" />
                                    </Pressable>
                                </View>
                                {editingUsername ? (
                                    <View style={styles.usernameContainer}>
                                        <TextInput
                                            style={styles.usernameInput}
                                            value={newUsername}
                                            onChangeText={setNewUsername}
                                        />
                                        <Pressable style={styles.updateButton} onPress={updateUsername}>
                                            <Text style={styles.updateButtonText}>Update</Text>
                                        </Pressable>
                                    </View>
                                ) : (
                                    <View style={styles.usernameContainer}>
                                        <FontAwesomeIcon icon={faUser} size={16} color="gray" />
                                        <Pressable onPress={handleUsernameClick}>
                                            <Text style={styles.name}>{user.GebruikersNaam}</Text>
                                        </Pressable>
                                    </View>
                                )}
                                <View style={styles.usernameContainer}>
                                    <FontAwesomeIcon icon={faEnvelope} size={16} color="gray" />
                                    <Text style={styles.name}>{user.Email}</Text>
                                </View>
                                <Pressable
                                    style={styles.updatePasswordButton}
                                    onPress={showPasswordPrompt ? () => setShowPasswordPrompt(false) : showUpdatePasswordPrompt}
                                >
                                    <Text style={styles.updatePasswordButtonText}>
                                        {showPasswordPrompt ? 'Cancel' : 'Update Password'}
                                    </Text>
                                </Pressable>
                                {showPasswordPrompt && (
                                    <View style={styles.passwordPrompt}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Current Password"
                                            placeholderTextColor="#B3B3B3"
                                            secureTextEntry
                                            value={currentPassword}
                                            onChangeText={setCurrentPassword}
                                        />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="New Password"
                                            placeholderTextColor="#B3B3B3"
                                            secureTextEntry
                                            value={newPassword}
                                            onChangeText={setNewPassword}
                                        />
                                        <Pressable style={styles.updateButton} onPress={updatePassword}>
                                            <Text style={styles.updateButtonText}>Update Password</Text>
                                        </Pressable>
                                    </View>

                                )}
                                <Pressable
                                    style={styles.logoutButton}
                                    onPress={handleLogout}
                                >
                                    <Text style={styles.logoutButtonText}>Logout</Text>
                                </Pressable>

                            </View>
                        ))}
                    </ScrollView>
                </Animatable.View>
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#181818',
    },

    card: {
        backgroundColor: '#282828',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        width: 300,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#404040',
    },
    editIconContainer: {
        position: 'absolute',
        bottom: -10,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 5,
    },
    usernameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginLeft: 10,
    },
    title: {
        fontSize: 16,
        color: '#B3B3B3',
        marginBottom: 10,
    },
    usernameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    usernameInput: {
        flex: 1,
        height: 40,
        borderColor: '#404040',
        borderWidth: 1,
        marginRight: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        color: '#FFFFFF',
    },
    updateButton: {
        backgroundColor: '#a336c1',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 0,
    },
    updateButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    updatePasswordButton: {
        backgroundColor: '#a336c1',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 30,
    },
    updatePasswordButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },

    logoutButton: {
        backgroundColor: '#a336c1',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 30,
    },
    logoutButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },

    passwordPrompt: {
        marginTop: 20,
        alignItems: 'center',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#404040',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        color: '#FFFFFF',
    },
});



export default UserInfoPage;
