import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
// 1. Importar o serviço de tradução
import { translate } from "../services/translations/translateServices";

const EventDetails = ({ route }) => {
    const navigation = useNavigation();
    const { event } = route.params;

    // 2. Criar um estado para armazenar os textos traduzidos
    const [t, setT] = useState({
        noTitle: "Event without title",
        today: "Today",
        overview: "Overview",
        noDescription: "No description available",
        hours: "Hours",
    });

    // 3. useEffect para buscar as traduções
    useEffect(() => {
        const fetchTranslations = async () => {
            try {
                const [noTitle, today, overview, noDescription, hours] = await Promise.all([
                    translate("Event without title", "en"),
                    translate("Today", "en"),
                    translate("Overview", "en"),
                    translate("No description available", "en"),
                    translate("Hours", "en")
                ]);
                setT({ noTitle, today, overview, noDescription, hours });
            } catch (error) {
                console.error("Falha ao buscar traduções:", error);
            }
        };
        fetchTranslations();
    }, []);

    const handleGoEvents = () => {
        navigation.navigate("ScheduleScreen");
    };

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const timeString = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        const dateString = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        return { timeString, dateString };
    };

    const isEventToday = () => {
        const startDate = new Date(event.startsAt);
        const today = new Date();
        return startDate.toDateString() === today.toDateString();
    };

    const getEventDuration = () => {
        const startDate = new Date(event.startsAt);
        const endDate = new Date(event.endsAt);
        const startFormatted = formatDateTime(event.startsAt);
        const endFormatted = formatDateTime(event.endsAt);

        if (startDate.toDateString() === endDate.toDateString()) {
            return `${startFormatted.timeString} - ${endFormatted.timeString}`;
        } else {
            return `${startFormatted.dateString} ${startFormatted.timeString} - ${endFormatted.dateString} ${endFormatted.timeString}`;
        }
    };

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

                        {/* 4. Usar os textos traduzidos */}
                        <Text style={styles.eventTitle}>
                            {event.eventName || t.noTitle}
                        </Text>

                        <View style={styles.dateTimeContainer}>
                            {isEventToday() && (
                                <View style={styles.todayBadge}>
                                    <Text style={styles.todayText}>{t.today}</Text>
                                </View>
                            )}
                            <Text style={styles.dateTimeText}>
                                {getEventDate()}
                            </Text>
                        </View>
                    </View>

                    {/* Content */}
                    <View style={styles.contentSection}>
                        <View style={styles.overviewSection}>
                            <Text style={styles.sectionTitle}>{t.overview}</Text>
                            <View style={styles.overviewTextContainer}>
                                <Text style={styles.overviewText}>
                                    {event.description || t.noDescription}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.hoursSection}>
                            <Text style={styles.hoursTitle}>{t.hours}</Text>
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