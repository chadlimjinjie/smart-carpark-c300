import React, { useState } from 'react';
import * as SecureStore from 'expo-secure-store';

import HomepageScreen from './HomepageScreen';
import Dashboard from './Dashboard';

export default function StaffManager() {

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
    
    getValueFor('role_id')

    if (role_id == 1) {
        return (
            <HomepageScreen />
        );
    } else if (role_id == 2) {
        return (
            <Dashboard />
        );
    } else {
        return null;
    }

}
