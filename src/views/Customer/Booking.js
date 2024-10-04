import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';

const Booking = ({ route }) => {
    const navigation = useNavigation();
    const { serviceName, prices, imageUrl } = route.params;
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');

    const handleSaveBooking = async () => {
        if (!bookingDate.trim() || !bookingTime.trim()) { 
            Alert.alert('Lỗi', 'Vui lòng nhập cả ngày/tháng/năm và thời gian');
            return;
        }

        try {
            const formattedDate = formatBookingDate(bookingDate);
            await firestore().collection('bookings').add({
                serviceName,
                prices,
                imageUrl,
                bookingDate: formattedDate,
                bookingTime,
                createdAt: firestore.FieldValue.serverTimestamp(),
            });
            Alert.alert('Thông báo', 'Đặt lịch thành công');
            navigation.navigate('HomeScreenCustomer');
        } catch (error) {
            Alert.alert('Error', 'Failed to save booking');
        }
    };

    const formatBookingDate = (date) => {
        const [day, month, year] = date.split('-');
        return `${year}-${month}-${day}`;
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Image
                    source={require('../../image/back_arrow.jpg')} 
                    style={{ width: 25, height: 25 }}
                />
            </TouchableOpacity>
            <Text style={styles.text}>Tên dịch vụ: {serviceName}</Text>
            <Text style={styles.text}>Giá: {prices}</Text>
            {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}

            <TextInput
                style={styles.input}
                placeholder="Nhập ngày-tháng-năm"
                value={bookingDate}
                onChangeText={setBookingDate}
            />
            <TextInput
                style={styles.input}
                placeholder="Nhập thời gian"
                value={bookingTime}
                onChangeText={setBookingTime}
            />

            <TouchableOpacity style={styles.addButton} onPress={handleSaveBooking}>
                <Text style={styles.buttonText}>Đặt Lịch</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5EFFF',
        padding: 20,
    },
    header: {
        backgroundColor: '#A594F9',
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        backgroundColor: '#E5D9F2',
        padding: 8,
        borderRadius: 12,
        marginRight: 15,
    },
    headerTitle: {
        color: '#F5EFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    contentCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        elevation: 3,
        borderLeftWidth: 5,
        borderLeftColor: '#CDC1FF',
        marginBottom: 20,
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
        color: '#333',
    },
    serviceText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#A594F9',
        marginBottom: 5,
    },
    priceText: {
        fontSize: 16,
        color: '#A594F9',
        backgroundColor: '#E5D9F2',
        padding: 8,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 15,
        marginVertical: 15,
    },
    input: {
        backgroundColor: '#F5EFFF',
        padding: 15,
        borderRadius: 12,
        marginTop: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#CDC1FF',
    },
    addButton: {
        backgroundColor: '#A594F9',
        borderRadius: 15,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        elevation: 3,
    },
    buttonText: {
        color: '#F5EFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
export default Booking;
