
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const EventDetails = () => {

    const navigation = useNavigation();

    const handleGoEvents = () => {
        navigation.navigate("ScheduleScreen")
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerTop}>
                            <TouchableOpacity>
                                <ArrowLeft size={24} color="#4B5563" onPress={() => handleGoEvents()} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuButton}>
                                <Text style={styles.menuText}>⋮</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Event Title */}
                        <Text style={styles.eventTitle}>Breakfast at family</Text>

                        {/* Event Date and Time */}
                        <View style={styles.dateTimeContainer}>
                            <View style={styles.todayBadge}>
                                <Text style={styles.todayText}>Today</Text>
                            </View>
                            <Text style={styles.dateTimeText}>Jun 24, Thu - 1:00pm - 3:00pm</Text>
                        </View>
                    </View>

                    {/* Content */}
                    <View style={styles.contentSection}>
                        {/* Overview Section */}
                        <View style={styles.overviewSection}>
                            <Text style={styles.sectionTitle}>Overview</Text>
                            <View style={styles.overviewTextContainer}>
                                <Text style={styles.overviewText}>
                                    Don't have enough time to make your home more cozy and comfortable? I am ready to help you with any task! I'm...
                                </Text>
                                <TouchableOpacity>
                                    <Text style={styles.readMoreText}>Read more</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Hours Section */}
                        <View style={styles.hoursSection}>
                            <Text style={styles.hoursTitle}>Hours</Text>
                            <Text style={styles.hoursText}>Jun 24, Thu - 1:00pm - 3:00pm</Text>
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
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 24,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    menuButton: {
        width: 32,
        height: 32,
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuText: {
        color: '#4B5563',
        fontSize: 16,
    },
    eventTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    dateTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    todayBadge: {
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 12,
    },
    todayText: {
        color: '#16A34A',
        fontSize: 14,
        fontWeight: '500',
    },
    dateTimeText: {
        color: '#6B7280',
        fontSize: 14,
    },
    contentSection: {
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    overviewSection: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 16,
    },
    overviewTextContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    overviewText: {
        color: '#4B5563',
        lineHeight: 24,
        flex: 1,
    },
    readMoreText: {
        color: '#3B82F6',
        fontWeight: '500',
    },
    hoursSection: {
        marginBottom: 24,
    },
    hoursTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
    },
    hoursText: {
        color: '#4B5563',
        fontSize: 16,
    },
});

export default EventDetails;
