import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const EditStudentModal = ({ visible, onClose, student, onSave, onDelete }) => {
    const [name, setName] = useState(student.name);
    const [studentNumber, setStudentNumber] = useState(student.studentNumber);
    const [studentClass, setStudentClass] = useState(student.studentClass || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setName(student.name);
        setStudentNumber(student.studentNumber);
        setStudentClass(student.studentClass || '');
    }, [student]);

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        const updatedStudent = {
            id: student.id,
            name,
            studentNumber,
            studentClass
        };
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/docent/updatestudent`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedStudent),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData);
                throw new Error('Failed to update student');
            }

            onSave(updatedStudent);
            onClose();
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/docent/deletestudent/${student.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to delete student');
            }

            onDelete(student.id);
            onClose();
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError(null);
        onClose();
    };
    return (
        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={handleClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Edit Student</Text>
                    <TouchableOpacity onPress={handleDelete} style={{ position: 'absolute', right: 130, top: 26 }}>
                        <FontAwesomeIcon icon={faTrash} size={16} color="red" />
                    </TouchableOpacity>
                    <TextInput
                        style={[styles.input, { color: '#fff' }]}
                        value={name}
                        onChangeText={setName}
                        placeholder="Name"
                        placeholderTextColor="#888"
                    />

                    
                    <TextInput
                        style={[styles.input, { color: 'grey' }]}
                        value={studentNumber + " (onaanpasbaar)"} 
                        onChangeText={setStudentNumber}
                        placeholder="Student Number"
                        placeholderTextColor="#888"
                        editable={false}
                        selectTextOnFocus={false}
                    />

                    <TextInput
                        style={[styles.input, { color: '#fff' }]}
                        value={studentClass}
                        onChangeText={setStudentClass}
                        placeholder="Class"
                        placeholderTextColor="#888"
                    />
                    {loading && <ActivityIndicator size="small" color="#fff" />}
                    {error && <Text style={styles.errorText}>{error}</Text>}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, { backgroundColor: '#555' }]} onPress={handleClose} disabled={loading}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, { backgroundColor: '#a336c1' }]} onPress={handleSave} disabled={loading}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContainer: {
        width: '80%',
        padding: 24,
        backgroundColor: '#1e1e1e',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
        textAlign: 'center',
    },
    input: {
        height: 56,
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 12,
        marginBottom: 20,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        marginHorizontal: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
    errorText: {
        color: '#ff6b6b',
        marginBottom: 20,
        textAlign: 'center',
    },
});

export default EditStudentModal;