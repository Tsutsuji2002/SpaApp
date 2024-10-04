import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import AddNewServices from './AddNewServices';
import ServiceDetails from './ServiceDetails';
import Profile from './Profile';
import firestore from '@react-native-firebase/firestore';

const Stack = createStackNavigator();

const HomeScreen = ({ navigation, route }) => {
    const [services, setServices] = useState([]);
    const [username, setUsername] = useState('');
    const userEmail = route.params?.userName;
    
    console.log("HomeScreen userEmail:", userEmail); // Debug log

    const fetchServices = useCallback(async () => {
        try {
            const servicesSnapshot = await firestore().collection('services').get();
            const servicesData = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setServices(servicesData);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    }, []);

    const fetchUserData = useCallback(async () => {
        if (!userEmail) {
            console.log('No user email provided');
            return;
        }

        try {
            console.log('Fetching user data for email:', userEmail); // Debug log
            const userSnapshot = await firestore()
                .collection('user')
                .where('email', '==', userEmail)
                .get();

            if (!userSnapshot.empty) {
                const userData = userSnapshot.docs[0].data();
                console.log('Found user data:', userData); // Debug log
                setUsername(userData.name);
            } else {
                console.log('User document does not exist for email:', userEmail);
                setUsername('User');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }, [userEmail]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    useFocusEffect(
        useCallback(() => {
            fetchServices();
        }, [fetchServices])
    );

    const handleServicePress = (service) => {
        navigation.navigate('ServiceDetails', { service, userEmail });
    };

    const renderItem = ({ item, index }) => (
        <TouchableOpacity style={styles.input} onPress={() => handleServicePress(item)}>
            <View style={styles.itemContainer}>
                <Text>{item.service}</Text>
                <Text>{item.prices} VNĐ</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.upperView}>
                <Text style={styles.username}>{username}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Profile', { userEmail })}>
                    <View style={styles.iconContainer}>
                        <Image
                            source={require('../../image/logo_user.jpg')}
                            style={{ width: 25, height: 25 }}
                        />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../image/logolab3.png')}
                        style={{ width: 200, height: 200 }}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.header}>
                    <Text style={styles.headerText}>DANH SÁCH DỊCH VỤ</Text>
                    <TouchableOpacity 
                        style={styles.addButton} 
                        onPress={() => navigation.navigate('AddNewServices', { userEmail })}
                    >
                        <Text style={styles.buttonText}>+</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={services}
                    renderItem={renderItem}
                    keyExtractor={item => String(item.id)}
                    style={styles.list}
                />
            </View>
        </View>
    );
};

const Home = ({ route }) => {
    const userName = route.params?.userName;
    console.log("Home wrapper userName:", userName); // Debug log

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                initialParams={{ userName: userName }}
            />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="AddNewServices" component={AddNewServices} />
            <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5EFFF',
    },
    upperView: {
        flexDirection: 'row',
        backgroundColor: '#A594F9',
        paddingVertical: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 5,
    },
    username: {
        color: '#F5EFFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginRight: 'auto',
    },
    iconContainer: {
        backgroundColor: '#E5D9F2',
        padding: 8,
        borderRadius: 20,
        elevation: 3,
    },
    contentContainer: {
        flex: 1,
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        flex: 1,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#A594F9',
    },
    addButton: {
        backgroundColor: '#A594F9',
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    buttonText: {
        fontSize: 24,
        color: '#F5EFFF',
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        marginBottom: 15,
        elevation: 2,
        borderLeftWidth: 5,
        borderLeftColor: '#CDC1FF',
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        color: '#0B192C'
    },
});

export default Home;
