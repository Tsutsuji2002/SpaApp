import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './Home';
import TransactionScreen from './Transaction';
import CustomerScreen from './Customer';
import SettingsScreen from './Settings';
import { Image } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = ({ route }) => {
    const userName = route.params?.userName;
    console.log("TabNavigator userName:", userName); // Debug log

    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen
                name="Home"
                component={HomeStackScreen}
                initialParams={{ userName: userName }} // Pass userName to HomeStackScreen
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Image
                            source={require('../../image/logo_home.png')} 
                            style={{ width: 25, height: 25 }}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Transaction"
                component={TransactionStackScreen}
                initialParams={{ userName: userName }}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Image
                            source={require('../../image/logo_transaction.png')} 
                            style={{ width: 25, height: 25 }}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Customer"
                component={CustomerStackScreen}
                initialParams={{ userName: userName }}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Image
                            source={require('../../image/logo_customer.png')} 
                            style={{ width: 25, height: 25 }}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsStackScreen}
                initialParams={{ userName: userName }}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Image
                            source={require('../../image/logo_setting.png')} 
                            style={{ width: 25, height: 25 }}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const HomeStackScreen = ({ route }) => {
    const userName = route.params?.userName;
    console.log("HomeStackScreen userName:", userName); // Debug log

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen 
                name="HomeScreen"
                component={HomeScreen}
                initialParams={{ userName: userName }}
            />
        </Stack.Navigator>
    );
};

const TransactionStackScreen = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Transaction" component={TransactionScreen} />
    </Stack.Navigator>
);

const CustomerStackScreen = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Customer" component={CustomerScreen} />
    </Stack.Navigator>
);

const SettingsStackScreen = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
);

export default TabNavigator;
