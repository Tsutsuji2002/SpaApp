import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileCustomer from './ProfileCustomer';
import firestore from '@react-native-firebase/firestore';
import Details from './Details';

const Stack = createStackNavigator();

const HomeScreenCustomer = ({ navigation, route }) => {
    const [services, setServices] = useState([]);
    const [username, setUsername] = useState('');
    const userEmail = route.params?.userName;
    
    console.log("HomeScreenCustomer userEmail:", userEmail);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const servicesSnapshot = await firestore().collection('services').get();
                const servicesData = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setServices(servicesData);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        const fetchUserData = async () => {
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
        };

        fetchServices();
        fetchUserData();

        const unsubscribe = navigation.addListener('focus', () => {
            fetchServices();
            fetchUserData();
        });

        return unsubscribe;
    }, [navigation, userEmail]);

    const handleServicePress = (service) => {
        navigation.navigate('Details', { service, userEmail });
    };

    const renderItem = ({ item, index }) => (
        <TouchableOpacity 
            style={styles.serviceCard} 
            onPress={() => handleServicePress(item)}
        >
            <View style={styles.serviceContent}>
                <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{item.service}</Text>
                    <Text style={styles.serviceDescription}>Dịch vụ chất lượng cho khách hàng của chúng tôi</Text>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>{item.prices}</Text>
                    <Text style={styles.currencyText}>VND</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.upperView}>
                <View style={styles.userInfoContainer}>
                    <Text style={styles.welcomeText}>Chào mừng trở lại,</Text>
                    <Text style={styles.username}>{username}</Text>
                </View>
                <TouchableOpacity 
                    style={styles.profileButton}
                    onPress={() => navigation.navigate('ProfileCustomer', { userEmail })}
                >
                    <Image
                        source={require('../../image/logo_user.jpg')}
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Dịch vụ spa</Text>
                    <Text style={styles.subHeaderText}>Chọn dịch vụ tốt nhất cho bạn</Text>
                </View>

                <FlatList
                    data={services}
                    renderItem={renderItem}
                    keyExtractor={item => String(item.id)}
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
};

const HomeCustomer = ({ route }) => {
    const userName = route.params?.userName;
    console.log("HomeCustomer wrapper userName:", userName); // Debug log

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="HomeScreenCustomer"
                component={HomeScreenCustomer}
                initialParams={{ userName: userName }}
            />
            <Stack.Screen name="ProfileCustomer" component={ProfileCustomer} />
            <Stack.Screen name="Details" component={Details} />
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
    userInfoContainer: {
        flex: 1,
    },
    welcomeText: {
        color: '#F5EFFF',
        fontSize: 14,
        opacity: 0.9,
    },
    username: {
        color: '#F5EFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    profileButton: {
        backgroundColor: '#E5D9F2',
        borderRadius: 20,
        padding: 2,
        elevation: 3,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    contentContainer: {
        flex: 1,
        padding: 20,
    },
    header: {
        marginBottom: 20,
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#A594F9',
        marginBottom: 5,
    },
    subHeaderText: {
        fontSize: 16,
        color: '#CDC1FF',
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingVertical: 10,
    },
    serviceCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        marginBottom: 15,
        padding: 15,
        elevation: 2,
        borderLeftWidth: 5,
        borderLeftColor: '#CDC1FF',
    },
    serviceContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    serviceInfo: {
        flex: 1,
        marginRight: 10,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    serviceDescription: {
        fontSize: 14,
        color: '#666',
    },
    priceContainer: {
        backgroundColor: '#E5D9F2',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    priceText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#A594F9',
    },
    currencyText: {
        fontSize: 12,
        color: '#A594F9',
        opacity: 0.8,
    }
});

export default HomeCustomer;
