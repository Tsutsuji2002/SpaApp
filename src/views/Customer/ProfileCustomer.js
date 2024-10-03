import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProfileCustomer = ({ route, navigation }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const userEmail = route.params?.userEmail;

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userEmail) {
                console.log('No user email provided');
                setLoading(false);
                return;
            }

            try {
                const userSnapshot = await firestore()
                    .collection('user')
                    .where('email', '==', userEmail)
                    .get();

                if (!userSnapshot.empty) {
                    const userData = userSnapshot.docs[0].data();
                    setUserData(userData);
                } else {
                    console.log('No user found for the provided email.');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userEmail]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Hồ sơ khách hàng</Text>
            </View>

            <View style={styles.profileContainer}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={require('../../image/logo_user.jpg')}
                        style={styles.avatarImage}
                    />
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#1e90ff" />
                    </View>
                ) : (
                    <View style={styles.infoContainer}>
                        <View style={styles.infoCard}>
                            <Text style={styles.infoLabel}>Tên</Text>
                            <Text style={styles.infoValue}>{userData?.name || 'N/A'}</Text>
                        </View>

                        <View style={styles.infoCard}>
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={styles.infoValue}>{userData?.email || 'N/A'}</Text>
                        </View>

                        <View style={styles.infoCard}>
                            <Text style={styles.infoLabel}>Vai trò</Text>
                            <Text style={styles.infoValue}>{userData?.role || 'N/A'}</Text>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    header: {
        backgroundColor: '#1e90ff',
        padding: 20,
        paddingTop: 40,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 5,
    },
    backButton: {
        padding: 10,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 20,
    },
    profileContainer: {
        flex: 1,
        padding: 20,
    },
    avatarContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    avatarImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#1e90ff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        padding: 20,
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        elevation: 2,
        borderLeftWidth: 5,
        borderLeftColor: '#1e90ff',
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    infoValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
});

export default ProfileCustomer;
