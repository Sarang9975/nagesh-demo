import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from './types'; // Ensure this file exists and is properly defined

const Preferences: React.FC = () => {
  const [preference, setPreference] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();

  const handleSelection = (option: string) => {
    setPreference(option);
    setShowOptions(true);
    Alert.alert('Preference Selected', `You selected: ${option}`);
  };

  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  const navigateToDialer = () => {
    navigation.navigate('Dialer');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Preference</Text>

      {!showOptions ? (
        <>
          <TouchableOpacity
            style={[styles.button, preference === 'Deaf' && styles.selectedButton]}
            onPress={() => handleSelection('Deaf')}
          >
            <Text style={styles.buttonText}>Deaf</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, preference === 'Mute' && styles.selectedButton]}
            onPress={() => handleSelection('Mute')}
          >
            <Text style={styles.buttonText}>Mute</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>What would you like to do next?</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={navigateToHome}
          >
            <Text style={styles.buttonText}>Go to Home Page</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={navigateToDialer}
          >
            <Text style={styles.buttonText}>Make a Call</Text>
          </TouchableOpacity>
        </>
      )}

      {preference && !showOptions && (
        <Text style={styles.selectedText}>Selected Preference: {preference}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
  },
  selectedButton: {
    backgroundColor: '#0056b3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});

export default Preferences;
