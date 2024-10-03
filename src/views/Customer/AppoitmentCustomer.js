import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore'; // Import Firestore from @react-native-firebase/firestore

const AppointmentCustomer = () => {
    const navigation = useNavigation();
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const unsubscribe = firestore().collection('bookings').onSnapshot(querySnapshot => {
            const bookingsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBookings(bookingsData);
        });

        return () => unsubscribe();
    }, []); 

    const deleteBooking = async (id) => {
        try {
            await firestore().collection('bookings').doc(id).delete();
            Alert.alert('Thông báo', 'Đặt lịch đã được xoá thành công');
        } catch (error) {
            console.error('Error deleting booking: ', error);
            Alert.alert('Error', 'Failed to delete booking');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Các dịch vụ đã đặt của bạn</Text>
            <FlatList
                data={bookings}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.bookingText}>Tên dịch vụ: {item.serviceName} {'\n'}</Text>  
                        <Text style={styles.bookingText}>Ngày: {item.bookingDate} {'\n'}</Text>
                        <Text style={styles.bookingText}>Giờ: {item.bookingTime}</Text>
                        <TouchableOpacity onPress={() => deleteBooking(item.id)} style={styles.deleteButton}>
                            <Text style={styles.deleteButtonText}>Xoá</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5EFFF',
    },
    header: {
        backgroundColor: '#A594F9',
        padding: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#F5EFFF',
        textAlign: 'center',
        marginTop: 10,
    },
    listContainer: {
        padding: 20,
    },
    item: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        elevation: 2,
        borderLeftWidth: 5,
        borderLeftColor: '#CDC1FF',
    },
    bookingText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    serviceTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#A594F9',
        marginBottom: 10,
    },
    dateTimeContainer: {
        backgroundColor: '#F5EFFF',
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
    },
    dateTimeText: {
        fontSize: 14,
        color: '#666',
    },
    deleteButton: {
        backgroundColor: '#A594F9',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        alignSelf: 'flex-end',
        marginTop: 10,
    },
    deleteButtonText: {
        color: '#F5EFFF',
        fontWeight: 'bold',
    },
});

export default AppointmentCustomer;
