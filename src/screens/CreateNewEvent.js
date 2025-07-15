import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ArrowLeft, Calendar } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient'; // Importando o LinearGradient
import { requestCreateEvent } from "../services/api";
import {
    ALERT_TYPE,
    AlertNotificationRoot,
    Toast,
} from "react-native-alert-notification";

const CreateNewEvent = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();

    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);

    const handleGoBack = () => {
        navigation.goBack();
    }

    const formatDate = (date) => {
        return date.toLocaleDateString('pt-BR');
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const onStartDateChange = (event, selectedDate) => {
        setShowStartDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setStartDate(selectedDate);
        }
    };

    const onStartTimeChange = (event, selectedTime) => {
        setShowStartTimePicker(Platform.OS === 'ios');
        if (selectedTime) {
            const newDate = new Date(startDate);
            newDate.setHours(selectedTime.getHours());
            newDate.setMinutes(selectedTime.getMinutes());
            setStartDate(newDate);
        }
    };

    const onEndDateChange = (event, selectedDate) => {
        setShowEndDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setEndDate(selectedDate);
        }
    };

    const onEndTimeChange = (event, selectedTime) => {
        setShowEndTimePicker(Platform.OS === 'ios');
        if (selectedTime) {
            const newDate = new Date(endDate);
            newDate.setHours(selectedTime.getHours());
            newDate.setMinutes(selectedTime.getMinutes());
            setEndDate(newDate);
        }
    };

    const handleCreateEvent = async () => {
        if (!eventName.trim() || !description.trim()) {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: t('createNewEvent.errorTitle'),
                textBody: t('createNewEvent.emptyFields'),
            });
            return;
        }

        const event = {
            eventName: eventName,
            owner: await AsyncStorage.getItem("userId"),
            description: description,
            startsAt: startDate,
            endsAt: endDate
        }

        try {
            const response = await requestCreateEvent(event);
            if (response.status === 201) {
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: t('createNewEvent.successTitle'),
                    textBody: t('createNewEvent.successMessage'),
                });
                const createdEvent = response.data;
                setTimeout(() => {
                    navigation.navigate("EventDetails", { event: createdEvent });
                }, 1500);
            } else {
                throw new Error("Failed to create event");
            }
        } catch (error) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: t('createNewEvent.errorTitle'),
                textBody: t('createNewEvent.errorMessage'),
            });
        }
    }

    return (
        <AlertNotificationRoot>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                            <ArrowLeft size={28} color="#1F2937" />
                        </TouchableOpacity>
                        <View style={styles.iconContainer}>
                            <LinearGradient
                                colors={['#60A5FA', '#3B82F6']}
                                style={styles.iconWrapper}
                            >
                                <Calendar size={32} color="white" />
                            </LinearGradient>
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{t('createNewEvent.title1')}</Text>
                            <Text style={styles.subtitle}>{t('createNewEvent.title2')}</Text>
                        </View>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <TextInput
                            placeholder={t('createNewEvent.eventNamePlaceholder')}
                            value={eventName}
                            onChangeText={setEventName}
                            style={styles.input}
                            placeholderTextColor="#9CA3AF"
                        />
                        <TextInput
                            placeholder={t('createNewEvent.descriptionPlaceholder')}
                            value={description}
                            onChangeText={setDescription}
                            style={[styles.input, styles.multilineInput]}
                            placeholderTextColor="#9CA3AF"
                            multiline
                        />

                        <Text style={styles.dateLabel}>{t('createNewEvent.startsAt') || 'Início'}</Text>
                        <View style={styles.timeRow}>
                            <TouchableOpacity style={styles.dateInput} onPress={() => setShowStartDatePicker(true)}>
                                <Calendar size={20} color="#6B7280" />
                                <Text style={styles.dateTimeText}>{formatDate(startDate)}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.dateInput} onPress={() => setShowStartTimePicker(true)}>
                                <Text style={styles.dateTimeText}>{formatTime(startDate)}</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.dateLabel}>{t('createNewEvent.endsAt') || 'Término'}</Text>
                        <View style={styles.timeRow}>
                            <TouchableOpacity style={styles.dateInput} onPress={() => setShowEndDatePicker(true)}>
                                <Calendar size={20} color="#6B7280" />
                                <Text style={styles.dateTimeText}>{formatDate(endDate)}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.dateInput} onPress={() => setShowEndTimePicker(true)}>
                                <Text style={styles.dateTimeText}>{formatTime(endDate)}</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={handleCreateEvent}>
                            <LinearGradient
                                colors={['#3B82F6', '#2563EB']}
                                style={styles.createButton}
                            >
                                <Text style={styles.createButtonText}>{t('createNewEvent.createButton')}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Date Time Pickers */}
                    {showStartDatePicker && <DateTimePicker value={startDate} mode="date" display="default" onChange={onStartDateChange} />}
                    {showStartTimePicker && <DateTimePicker value={startDate} mode="time" display="default" onChange={onStartTimeChange} />}
                    {showEndDatePicker && <DateTimePicker value={endDate} mode="date" display="default" onChange={onEndDateChange} />}
                    {showEndTimePicker && <DateTimePicker value={endDate} mode="time" display="default" onChange={onEndTimeChange} />}
                </ScrollView>
            </KeyboardAvoidingView>
        </AlertNotificationRoot>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 24,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    iconWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    titleContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#111827',
    },
    subtitle: {
        fontSize: 20,
        color: '#3B82F6',
        fontWeight: '600',
    },
    form: {
        paddingHorizontal: 24,
        paddingTop: 40,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        fontSize: 16,
        color: '#1F2937',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    multilineInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    dateLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
        marginLeft: 4,
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    dateInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginHorizontal: 4,
    },
    dateTimeText: {
        fontSize: 16,
        color: '#1F2937',
        marginLeft: 10,
    },
    createButton: {
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: "#2563EB",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    createButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CreateNewEvent;