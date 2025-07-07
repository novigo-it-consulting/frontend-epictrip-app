import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ArrowLeft, Calendar } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestCreateEvent } from "../services/api";
import {
    ALERT_TYPE,
    AlertNotificationRoot,
    Toast,
} from "react-native-alert-notification";
// 1. Importar o serviço de tradução
import { translate } from "../services/translations/translateServices";

const CreateNewEvent = () => {
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);

    // 2. Criar um estado para armazenar os textos traduzidos
    const [t, setT] = useState({
        createYour: "Create your",
        amazingEvent: "amazing event",
        eventName: "Event name",
        description: "Description",
        createEvent: "Create event",
        errorCreating: "Error Creating Event. Try again later!",
    });

    const navigation = useNavigation();

    // 3. useEffect para buscar as traduções
    useEffect(() => {
        const fetchTranslations = async () => {
            try {
                const [
                    createYour, amazingEvent, eventName,
                    description, createEvent, errorCreating
                ] = await Promise.all([
                    translate("Create your", "en"),
                    translate("amazing event", "en"),
                    translate("Event name", "en"),
                    translate("Description", "en"),
                    translate("Create event", "en"),
                    translate("Error Creating Event. Try again later!", "en"),
                ]);
                setT({
                    createYour, amazingEvent, eventName,
                    description, createEvent, errorCreating
                });
            } catch (error) {
                console.error("Falha ao buscar traduções:", error);
            }
        };
        fetchTranslations();
    }, []);


    const handleGoBack = () => {
        navigation.goBack();
    };

    const formatDate = (date) => {
        return date.toLocaleDateString();
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
        const event = {
            eventName: eventName,
            owner: await AsyncStorage.getItem("userId"),
            description: description,
            startsAt: startDate,
            endsAt: endDate
        };
        try {
            const response = await requestCreateEvent(event);
            if (response.status === 201) {
                navigation.navigate("EventDetails");
            } else {
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: "Ops",
                    textBody: t.errorCreating,
                });
            }
        } catch (error) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: "Ops",
                textBody: t.errorCreating,
            });
        }
    };

    return (
        <AlertNotificationRoot>
            <View style={styles.container}>
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerTop}>
                            <TouchableOpacity style={styles.backButton} onPress={() => handleGoBack()}>
                                <ArrowLeft size={24} color="#374151" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.iconContainer}>
                            <View style={styles.iconWrapper}>
                                <View style={styles.iconInner}>
                                    <Calendar size={24} color="white" />
                                </View>
                            </View>
                        </View>

                        {/* 4. Usar os textos traduzidos */}
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{t.createYour}</Text>
                            <Text style={styles.title}>{t.amazingEvent}</Text>
                        </View>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <View style={styles.inputWrapper}>
                                <Text style={styles.inputIcon}>@</Text>
                                <TextInput
                                    placeholder={t.eventName}
                                    value={eventName}
                                    onChangeText={setEventName}
                                    style={styles.input}
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.inputWrapper}>
                                <Text style={styles.inputIcon}>@</Text>
                                <TextInput
                                    placeholder={t.description}
                                    value={description}
                                    onChangeText={setDescription}
                                    style={styles.input}
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.timeRow}>
                                <TouchableOpacity
                                    style={[styles.inputWrapper, styles.timeInput]}
                                    onPress={() => setShowStartDatePicker(true)}
                                >
                                    <Calendar size={20} color="#9CA3AF" style={styles.calendarIcon} />
                                    <Text style={styles.dateTimeText}>{formatDate(startDate)}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.inputWrapper, styles.timeInput]}
                                    onPress={() => setShowStartTimePicker(true)}
                                >
                                    <Calendar size={20} color="#9CA3AF" style={styles.calendarIcon} />
                                    <Text style={styles.dateTimeText}>{formatTime(startDate)}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.timeRow}>
                                <TouchableOpacity
                                    style={[styles.inputWrapper, styles.timeInput]}
                                    onPress={() => setShowEndDatePicker(true)}
                                >
                                    <Calendar size={20} color="#9CA3AF" style={styles.calendarIcon} />
                                    <Text style={styles.dateTimeText}>{formatDate(endDate)}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.inputWrapper, styles.timeInput]}
                                    onPress={() => setShowEndTimePicker(true)}
                                >
                                    <Calendar size={20} color="#9CA3AF" style={styles.calendarIcon} />
                                    <Text style={styles.dateTimeText}>{formatTime(endDate)}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={handleCreateEvent}
                            style={styles.createButton}
                        >
                            <Text style={styles.createButtonText}>{t.createEvent}</Text>
                        </TouchableOpacity>
                    </View>

                    {showStartDatePicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onStartDateChange}
                        />
                    )}

                    {showStartTimePicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="time"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onStartTimeChange}
                        />
                    )}

                    {showEndDatePicker && (
                        <DateTimePicker
                            value={endDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onEndDateChange}
                        />
                    )}

                    {showEndTimePicker && (
                        <DateTimePicker
                            value={endDate}
                            mode="time"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onEndTimeChange}
                        />
                    )}
                </View>
            </View>
        </AlertNotificationRoot>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    content: {
        flex: 1,
        maxWidth: 384,
        alignSelf: 'center',
        width: '100%',
    },
    header: {
        backgroundColor: 'white',
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 32,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 48,
    },
    backButton: {
        marginRight: 16,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 48,
    },
    iconWrapper: {
        width: 80,
        height: 80,
        backgroundColor: '#DBEAFE',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconInner: {
        width: 48,
        height: 48,
        backgroundColor: '#3B82F6',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    form: {
        paddingHorizontal: 24,
    },
    inputContainer: {
        marginBottom: 24,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    inputIcon: {
        fontSize: 18,
        color: '#9CA3AF',
        marginRight: 8,
    },
    calendarIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#374151',
    },
    dateTimeText: {
        flex: 1,
        fontSize: 16,
        color: '#374151',
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timeInput: {
        width: '48%',
    },
    createButton: {
        backgroundColor: '#DBEAFE',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    createButtonText: {
        color: '#2563EB',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default CreateNewEvent;