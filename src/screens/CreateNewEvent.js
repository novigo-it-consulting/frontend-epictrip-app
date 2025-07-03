import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ArrowLeft, Calendar } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestCreateEvent } from "../services/api";
import {
    ALERT_TYPE,
    AlertNotificationRoot,
    Toast,
} from "react-native-alert-notification";

const CreateNewEvent = () => {
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);

    const navigation = useNavigation();

    const handleGoBack = () => {
        navigation.goBack();
    }

    const formatDate = (date) => {
        return date.toLocaleDateString();
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const onStartDateChange = (event, selectedDate) => {
        setShowStartDatePicker(false);
        if (selectedDate) {
            setStartDate(selectedDate);
        }
    };

    const onStartTimeChange = (event, selectedTime) => {
        setShowStartTimePicker(false);
        if (selectedTime) {
            const newDate = new Date(startDate);
            newDate.setHours(selectedTime.getHours());
            newDate.setMinutes(selectedTime.getMinutes());
            setStartDate(newDate);
        }
    };

    const onEndDateChange = (event, selectedDate) => {
        setShowEndDatePicker(false);
        if (selectedDate) {
            setEndDate(selectedDate);
        }
    };

    const onEndTimeChange = (event, selectedTime) => {
        setShowEndTimePicker(false);
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
        }
        const response = await requestCreateEvent(event);
        if (response.status === 201) {
            navigation.navigate("EventDetails")
        } else {
            alert("Error Creating Event. Try again later!")
            // Toast.show({
            //     type: ALERT_TYPE.DANGER,
            //     title: "Ops",
            //     textBody: "Error creating event. Try again later!",
            // });
        }
    }

    return (
        <View style={styles.container}>
            <Toast />
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <TouchableOpacity style={styles.backButton} onPress={() => handleGoBack()}>
                            <ArrowLeft size={24} color="#374151" />
                        </TouchableOpacity>
                    </View>

                    {/* Calendar Icon */}
                    <View style={styles.iconContainer}>
                        <View style={styles.iconWrapper}>
                            <View style={styles.iconInner}>
                                <Calendar size={24} color="white" />
                            </View>
                        </View>
                    </View>

                    {/* Title */}
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Create your</Text>
                        <Text style={styles.title}>amazing event</Text>
                    </View>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {/* Event Name */}
                    <View style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputIcon}>@</Text>
                            <TextInput
                                placeholder="Event name"
                                value={eventName}
                                onChangeText={setEventName}
                                style={styles.input}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputIcon}>@</Text>
                            <TextInput
                                placeholder="Description"
                                value={description}
                                onChangeText={setDescription}
                                style={styles.input}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>

                    {/* Start Date and Time */}
                    <View style={styles.inputContainer}>
                        <View style={styles.timeRow}>
                            {/* Start Date */}
                            <TouchableOpacity
                                style={[styles.inputWrapper, styles.timeInput]}
                                onPress={() => setShowStartDatePicker(true)}
                            >
                                <Calendar size={20} color="#9CA3AF" style={styles.calendarIcon} />
                                <Text style={styles.dateTimeText}>{formatDate(startDate)}</Text>
                            </TouchableOpacity>

                            {/* Start Time */}
                            <TouchableOpacity
                                style={[styles.inputWrapper, styles.timeInput]}
                                onPress={() => setShowStartTimePicker(true)}
                            >
                                <Calendar size={20} color="#9CA3AF" style={styles.calendarIcon} />
                                <Text style={styles.dateTimeText}>{formatTime(startDate)}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* End Date and Time */}
                    <View style={styles.inputContainer}>
                        <View style={styles.timeRow}>
                            {/* End Date */}
                            <TouchableOpacity
                                style={[styles.inputWrapper, styles.timeInput]}
                                onPress={() => setShowEndDatePicker(true)}
                            >
                                <Calendar size={20} color="#9CA3AF" style={styles.calendarIcon} />
                                <Text style={styles.dateTimeText}>{formatDate(endDate)}</Text>
                            </TouchableOpacity>

                            {/* End Time */}
                            <TouchableOpacity
                                style={[styles.inputWrapper, styles.timeInput]}
                                onPress={() => setShowEndTimePicker(true)}
                            >
                                <Calendar size={20} color="#9CA3AF" style={styles.calendarIcon} />
                                <Text style={styles.dateTimeText}>{formatTime(endDate)}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Create Event Button */}
                    <TouchableOpacity
                        onPress={handleCreateEvent}
                        style={styles.createButton}
                    >
                        <Text style={styles.createButtonText}>Create event</Text>
                    </TouchableOpacity>
                </View>

                {/* Date Time Pickers */}
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