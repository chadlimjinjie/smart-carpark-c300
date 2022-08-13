import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as api from './api/api';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import { NavigationContainer, DrawerActions, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Login } from './components/Login';
import { Registration } from './components/Registration';
import { ForgotPassword } from './components/ForgotPassword';
import { ResetPassword } from './components/ResetPassword';

import StaffManager from './components/StaffManager';
import Reservation from './components/Reservation';
import Confirmation from './components/Confirmation';
import NotificationCentre from './components/NotificationCentre';

import { ManagerBroadcast } from './components/ManagerBroadcast';
import ProfilePage from './components/ProfilePage';
import ViewManager from './components/ViewManager';
import RoleManagement from './components/RoleManagement';
import { ManagerSettingForm } from './components/ManagerSettingForm';
import { ChargerRobotSettings } from './components/ChargerRobotSettings';
import Checkout from './components/Checkout';
import Report from './components/Report';
import ReservationSharing from './components/ReservationSharing';
import RobotBooking from './components/RobotBooking';
import { IncomeReport } from './components/IncomeReport';
import ChatBot from './components/ChatBot';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function StaffManagerStack() {

  const [userId, setUserId] = useState(0);
  const [userPic, setUserPic] = useState("");

  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (key == 'user_id') {
      setUserId(result);
    }
  }

  useEffect(() => {
    getValueFor('user_id');
    api.getProfilePic(userId).then(data => {
      if (data.length > 0) {
        setUserPic(data[0].face);
      }
    });
  });

  var base64Image = `data:image/png;base64,{${userPic}}`

  return (
    <Stack.Navigator screenOptions={({ navigation }) => ({
      headerLeft: () => (
        <TouchableOpacity onPress={navigation.openDrawer} style={{ marginLeft: 10 }}>
          <MaterialIcons name="menu" size={40} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("Profile Page")} style={{ marginRight: 10, }}>
          {userPic !== null ? <Image style={[styles.image]} source={{ uri: base64Image }} /> : <View style={[styles.image, { alignItems: 'center' }]}><MaterialIcons name="person-outline" size={40} color="black" /></View>}
        </TouchableOpacity>
      )
    })}>
      <Stack.Screen name="Dashboard" component={StaffManager} options={{ cardStyle: { backgroundColor: '#fff' } }} />
      <Stack.Screen name="Profile Page" component={ProfilePage} options={{ cardStyle: { backgroundColor: '#fff' } }} />
    </Stack.Navigator>
  );
}

function ReservationStack() {
  return (
    <Stack.Navigator screenOptions={({ navigation }) => ({
      headerLeft: () => (
        <TouchableOpacity onPress={navigation.openDrawer} style={{ marginLeft: 10 }}>
          <MaterialIcons name="menu" size={40} color="black" />
        </TouchableOpacity>
      )
    })}>
      <Stack.Screen name="Reservation" component={Reservation} />
      <Stack.Screen name="Confirmation" component={Confirmation} />
    </Stack.Navigator>
  );
}

function NotificationStack() {
  return (
    <Stack.Navigator screenOptions={({ navigation }) => ({
      headerLeft: () => (
        <TouchableOpacity onPress={navigation.openDrawer} style={{ marginLeft: 10 }}>
          <MaterialIcons name="menu" size={40} color="black" />
        </TouchableOpacity>
      )
    })}>
      <Stack.Screen name="Notification" component={NotificationCentre} options={{ cardStyle: { backgroundColor: '#fff' } }} />
    </Stack.Navigator>
  );
}

function AppTab() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused }) => {
        let iconName;

        if (route.name === 'Dashboard') {
          iconName = focused ? 'home-outline' : 'home-outline';
        } else if (route.name === 'Reservation') {
          iconName = focused ? 'form-select' : 'form-select';
        } else if (route.name === 'Notification') {
          iconName = focused ? 'bell-outline' : 'bell-outline';
        }

        // You can return any component that you like here!
        return <MaterialCommunityIcons name={iconName} size={24} color="black" />;
      },
    })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen name="Dashboard" component={StaffManagerStack} />
      <Tab.Screen name="Reservation" component={ReservationStack} />
      <Tab.Screen name="Notification" component={NotificationStack} />
    </Tab.Navigator>
  );
}

function ViewManagerStack() {
  return (
    <Stack.Navigator screenOptions={({ navigation }) => ({
      headerLeft: () => (
        <TouchableOpacity onPress={navigation.openDrawer} style={{ marginLeft: 10 }}>
          <MaterialIcons name="menu" size={40} color="black" />
        </TouchableOpacity>
      )
    })}>
      <Stack.Screen name="View Manager" component={ViewManager} />
    </Stack.Navigator>
  );
}

function RoleManagementStack() {
  return (
    <Stack.Navigator screenOptions={({ navigation }) => ({
      headerLeft: () => (
        <TouchableOpacity onPress={navigation.openDrawer} style={{ marginLeft: 10 }}>
          <MaterialIcons name="menu" size={40} color="black" />
        </TouchableOpacity>
      )
    })}>
      <Stack.Screen name="Role Management" component={RoleManagement} />
    </Stack.Navigator>
  );
}

function CarparkSettingsStack() {
  return (
    <Stack.Navigator screenOptions={({ navigation }) => ({
      headerLeft: () => (
        <TouchableOpacity onPress={navigation.openDrawer} style={{ marginLeft: 10 }}>
          <MaterialIcons name="menu" size={40} color="black" />
        </TouchableOpacity>
      )
    })}>
      <Stack.Screen name="Carpark Settings" component={ManagerSettingForm} />
    </Stack.Navigator>
  );
}

function RobotSettingsStack() {
  return (
    <Stack.Navigator screenOptions={({ navigation }) => ({
      headerLeft: () => (
        <TouchableOpacity onPress={navigation.openDrawer} style={{ marginLeft: 10 }}>
          <MaterialIcons name="menu" size={40} color="black" />
        </TouchableOpacity>
      )
    })}>
      <Stack.Screen name="Robot Settings" component={ChargerRobotSettings} />
    </Stack.Navigator>
  );
}

function ReservationHistoryStack() {
  return (
    <Stack.Navigator screenOptions={({ navigation }) => ({
      headerLeft: () => (
        <TouchableOpacity onPress={navigation.openDrawer} style={{ marginLeft: 10 }}>
          <MaterialIcons name="menu" size={40} color="black" />
        </TouchableOpacity>
      )
    })}>
      <Stack.Screen name="Reservation History" component={Report} />
    </Stack.Navigator>
  );
}

function AppDrawer() {
  const [role_id, setRole_id] = useState("");
  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (key == 'user_id') {
      setUser_id(result);
    }
    if (key == 'email') {
      setEmail(result);
    }
    if (key == 'fullname') {
      setFullname(result);
    }
    if (key == 'role_id') {
      setRole_id(result);
    }
  }
  getValueFor('role_id');
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Dashboard" component={AppTab} />
      {role_id == 2 ? <Drawer.Screen name="Reservation History" component={ReservationHistoryStack} /> : null}
      <Drawer.Screen name="Reservation Sharing" component={ReservationSharing} />
      {role_id == 2 ? <Drawer.Screen name="Manager Broadcast" component={ManagerBroadcast} /> : null}
      <Drawer.Screen name="View Manager" component={ViewManagerStack} />
      <Drawer.Screen name="Robot Booking" component={RobotBooking} />
      <Drawer.Screen name="Chat Bot" component={ChatBot} />
      {role_id == 2 ? <Drawer.Screen name="Income Report" component={IncomeReport} /> : null}
      {role_id == 2 ? <Drawer.Screen name="Carpark Settings" component={CarparkSettingsStack} /> : null}
      {role_id == 2 ? <Drawer.Screen name="Robot Settings" component={RobotSettingsStack} /> : null}
      {role_id == 2 ? <Drawer.Screen name="Role Management" component={RoleManagementStack} /> : null}
      {role_id == 2 ? <Drawer.Screen name="Checkout Complimentary Pass" component={Checkout} /> : null}
      <Drawer.Screen name="Logout" component={Logout} />
    </Drawer.Navigator>
  );
}

function Logout({ navigation }) {
  useEffect(() => {
    navigation.navigate("Login");
  }, []);
  return null;
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registration" component={Registration} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="Dashboard" component={AppDrawer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 46,
    height: 46,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#694BBE'
  }
});