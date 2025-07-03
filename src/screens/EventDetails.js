import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { requestGetEventById } from '../services/api';

const EventDetails = ({ route }) => {
    const navigation = useNavigation();
    const { event } = route.params;

    const handleGoEvents = () => {
        navigation.navigate("ScheduleScreen")
    }

    // Function to format date and time
    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const today = new Date();

        // Check if it's today
        const isToday = date.toDateString() === today.toDateString();

        // Format time (e.g., "7:59 PM")
        const timeString = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        // Format date (e.g., "July 3, 2025")
        const dateString = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return { timeString, dateString, isToday };
    };

    // Check if event is today
    const isEventToday = () => {
        const startDate = new Date(event.startsAt);
        const today = new Date();
        return startDate.toDateString() === today.toDateString();
    };

    // Format the event duration
    const getEventDuration = () => {
        const startDate = new Date(event.startsAt);
        const endDate = new Date(event.endsAt);

        const startFormatted = formatDateTime(event.startsAt);
        const endFormatted = formatDateTime(event.endsAt);

        // If same day, show "10:00 AM - 2:00 PM"
        if (startDate.toDateString() === endDate.toDateString()) {
            return `${startFormatted.timeString} - ${endFormatted.timeString}`;
        } else {
            // If different days, show full date and time
            return `${startFormatted.dateString} ${startFormatted.timeString} - ${endFormatted.dateString} ${endFormatted.timeString}`;
        }
    };

    // Get the event date for display
    const getEventDate = () => {
        const startDate = new Date(event.startsAt);
        return startDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerTop}>
                            <TouchableOpacity onPress={() => handleGoEvents()}>
                                <ArrowLeft size={24} color="#4B5563" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuButton}>
                                <Text style={styles.menuText}>⋮</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Event Title */}
                        <Text style={styles.eventTitle}>
                            {event.eventName || "Event without title"}
                        </Text>

                        {/* Event Date and Time */}
                        <View style={styles.dateTimeContainer}>
                            {isEventToday() && (
                                <View style={styles.todayBadge}>
                                    <Text style={styles.todayText}>Today</Text>
                                </View>
                            )}
                            <Text style={styles.dateTimeText}>
                                {getEventDate()}
                            </Text>
                        </View>
                    </View>

                    {/* Content */}
                    <View style={styles.contentSection}>
                        {/* Overview Section */}
                        <View style={styles.overviewSection}>
                            <Text style={styles.sectionTitle}>Overview</Text>
                            <View style={styles.overviewTextContainer}>
                                <Text style={styles.overviewText}>
                                    {event.description || "No description available"}
                                </Text>
                            </View>
                        </View>

                        {/* Hours Section */}
                        <View style={styles.hoursSection}>
                            <Text style={styles.hoursTitle}>Hours</Text>
                            <Text style={styles.hoursText}>
                                {getEventDuration()}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
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
        backgroundColor: 'white',
        borderRadius: 12,
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 32,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    menuButton: {
        width: 36,
        height: 36,
        backgroundColor: '#F3F4F6',
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuText: {
        color: '#4B5563',
        fontSize: 18,
        fontWeight: 'bold',
    },
    eventTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 16,
        lineHeight: 34,
    },
    dateTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    todayBadge: {
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 12,
        marginBottom: 4,
    },
    todayText: {
        color: '#16A34A',
        fontSize: 14,
        fontWeight: '600',
    },
    dateTimeText: {
        color: '#6B7280',
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
    contentSection: {
        paddingHorizontal: 24,
        paddingVertical: 24,
    },
    overviewSection: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 16,
    },
    overviewTextContainer: {
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#3B82F6',
    },
    overviewText: {
        color: '#4B5563',
        lineHeight: 24,
        fontSize: 16,
    },
    hoursSection: {
        backgroundColor: '#F8FAFC',
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    hoursTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 12,
    },
    hoursText: {
        color: '#4B5563',
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 22,
    },
});

export default EventDetails;
