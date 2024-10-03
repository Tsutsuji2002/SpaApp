import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Customer = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const snapshot = await firestore().collection('bookings').get();
                const bookingsData = snapshot.docs.map(doc => doc.data());
                setBookings(bookingsData);
            } catch (error) {
                console.error('Error fetching bookings: ', error);
            }
        };

        fetchBookings();
    }, []);

    const renderBookingItem = ({ item }) => (
        <View style={styles.bookingCard}>
            <View style={styles.bookingHeader}>
                <Text style={styles.serviceName}>{item.serviceName}</Text>
                <Text style={styles.price}>{item.prices} VND</Text>
            </View>
            <View style={styles.bookingDetails}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Ngày:</Text>
                    <Text style={styles.detailValue}>{item.bookingDate}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Giờ:</Text>
                    <Text style={styles.detailValue}>{item.bookingTime}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Đơn đặt</Text>
            </View>
            <FlatList
                data={bookings}
                renderItem={renderBookingItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.listContainer}
            />
        </View>
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
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#F5EFFF',
        textAlign: 'center',
    },
    listContainer: {
        padding: 20,
    },
    bookingCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        elevation: 2,
        borderLeftWidth: 5,
        borderLeftColor: '#CDC1FF',
    },
    bookingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#A594F9',
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
        color: '#A594F9',
        backgroundColor: '#E5D9F2',
        padding: 8,
        borderRadius: 10,
    },
    bookingDetails: {
        backgroundColor: '#F5EFFF',
        borderRadius: 10,
        padding: 10,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    detailLabel: {
        color: '#666',
        fontSize: 14,
    },
    detailValue: {
        color: '#333',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default Customer;
