import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Alert, Image, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-crop-picker'; // Thư viện image picker thay thế
import firestore from '@react-native-firebase/firestore';

const ServiceDetails = ({ route, navigation }) => {
    const { service } = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(true);
    const [updatedServiceName, setUpdatedServiceName] = useState(service.service);
    const [updatedPrices, setUpdatedPrices] = useState(service.prices);
    const [imageUrl, setImageUrl] = useState(service.imageUrl);

    const handleChooseImage = () => {
        ImagePicker.openPicker({}).then(image => {
            const source = { uri: image.path };
            setImageUrl(source.uri);
        }).catch(error => {
            console.log(error);
        });
    };

    const handleUpdate = async () => {
        if (updatedServiceName.trim() === '' || updatedPrices.trim() === '') {
            Alert.alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        try {
            const querySnapshot = await firestore()
                .collection('services')
                .where('service', '==', service.service)
                .get();

            querySnapshot.forEach(async documentSnapshot => {
                await documentSnapshot.ref.update({
                    service: updatedServiceName.trim(),
                    prices: updatedPrices.trim(),
                    imageUrl: imageUrl,
                });
            });

            console.log('Service updated successfully');
            Alert.alert('Thông báo', 'Bạn đã chỉnh sửa thành công');
            setModalVisible(false);
            navigation.navigate('Home');
        } catch (error) {
            console.error('Error updating service:', error);
            Alert.alert('Thông báo', 'Chỉnh sửa không thành công');
        }
    };

    const handleDelete = async () => {
        
    };

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={require('../../image/back_arrow.jpg')} 
                        style={{ width: 25, height: 25 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setIsEditMode(true);
                    setModalVisible(true);
                }} style={styles.editButton}>
                    <Image
                        source={require('../../image/logo_slide.png')} 
                        style={{ width: 25, height: 25 }}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.containerWrapper}>
                {imageUrl && (
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                )}
                <TouchableOpacity onPress={handleChooseImage} style={styles.chooseImageButton}>
                    <Text style={styles.chooseImageText}>Chọn ảnh</Text>
                </TouchableOpacity>
                <View style={styles.section}>
                    <Text style={styles.label}>Tên dịch vụ:</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={updatedServiceName}
                            onChangeText={setUpdatedServiceName}
                            placeholder="Tên dịch vụ"
                            editable={isEditMode}
                        />
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Giá:</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={updatedPrices}
                            onChangeText={setUpdatedPrices}
                            placeholder="Giá"
                            keyboardType="numeric"
                            editable={isEditMode}
                        />
                    </View>
                </View>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={handleUpdate}>
                            <Text style={styles.modalButton}>Chỉnh sửa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete}>
                            <Text style={[styles.modalButton, styles.deleteButton]}>Xoá</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Text style={styles.modalButton}>Huỷ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5EFFF',
        padding: 20,
    },
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#A594F9',
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: '#E5D9F2',
        padding: 10,
        borderRadius: 12,
    },
    editButton: {
        backgroundColor: '#E5D9F2',
        padding: 10,
        borderRadius: 12,
    },
    containerWrapper: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        elevation: 3,
    },
    section: {
        marginBottom: 15,
    },
    label: {
        color: '#A594F9',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    inputContainer: {
        backgroundColor: '#F5EFFF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#CDC1FF',
    },
    input: {
        padding: 12,
        color: '#333',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 15,
        marginBottom: 20,
    },
    chooseImageButton: {
        backgroundColor: '#E5D9F2',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 15,
    },
    chooseImageText: {
        color: '#A594F9',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(165, 148, 249, 0.3)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        padding: 25,
        borderRadius: 20,
        elevation: 5,
        width: '80%',
    },
    modalButton: {
        backgroundColor: '#E5D9F2',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    modalButtonText: {
        color: '#A594F9',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: '#FFE5E5',
    },
    deleteButtonText: {
        color: '#FF4444',
    },
});
export default ServiceDetails;
