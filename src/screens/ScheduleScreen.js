import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Plus, Play } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { requestGetEvents } from '../services/api';
import CustomTabBar from "../components/CustomBar";

const ScheduleScreen = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dates, setDates] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const generateWeekDates = () => {
      const today = new Date();
      const weekDates = [];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      for (let i = 0; i < 7; i++) {
        // Loop para hoje + 6 dias seguintes
        const date = new Date(today);
        date.setDate(today.getDate() + i); // Adiciona 'i' dias à data de hoje

        weekDates.push({
          day: dayNames[date.getDay()],
          date: date.getDate(),
          fullDate: new Date(date),
        });
      }

      setDates(weekDates);
      getEvents();
    };

    generateWeekDates();
  }, []);

  const isSameDate = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isDateInRange = (targetDate, startDate, endDate) => {
    const target = new Date(targetDate);
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Zerar as horas para comparar apenas as datas
    target.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    return target >= start && target <= end;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatEventTime = (startsAt, endsAt) => {
    const startTime = formatTime(startsAt);
    const endTime = formatTime(endsAt);
    return `${startTime} - ${endTime}`;
  };

  const getEventsForSelectedDate = () => {
    return events.filter(event => {
      return isDateInRange(selectedDate, event.startsAt, event.endsAt);
    });
  };

  const handleGoCreateNewEvent = () => {
    navigation.navigate('CreateNewEvent');
  };

  const handleGoEventDetails = (event) => {
    navigation.navigate('EventDetails', { event });
  };

  const getEvents = async () => {
    try {
      const response = await requestGetEvents();
      console.log(response);
      if (response && Array.isArray(response.data)) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };

  const getEventColor = (index) => {
    const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];
    return colors[index % colors.length];
  };

  const selectedDateEvents = getEventsForSelectedDate();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Cabeçalho */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Schedule</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => handleGoCreateNewEvent()}>
              <Plus size={18} color="#4B5563" />
            </TouchableOpacity>
          </View>

          {/* Seção de Datas */}
          <View>
            <Text style={styles.sectionTitle}>Booking date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {dates.map(dateItem => {
                const isActive = isSameDate(selectedDate, dateItem.fullDate);
                return (
                  <TouchableOpacity
                    key={dateItem.fullDate.toISOString()}
                    onPress={() => setSelectedDate(dateItem.fullDate)}
                    style={[styles.dateButton, isActive && styles.dateButtonActive]}>
                    <Text
                      style={[
                        styles.dateDay,
                        isActive && styles.dateTextActive,
                      ]}>
                      {dateItem.day}
                    </Text>
                    <Text
                      style={[
                        styles.dateNumber,
                        isActive && styles.dateTextActive,
                      ]}>
                      {dateItem.date}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>

        {/* Seção de Eventos */}
        <View style={styles.todayContainer}>
          <Text style={styles.sectionTitle}>
            {isSameDate(selectedDate, new Date()) ? 'Today' : 'Events'}
          </Text>
          <View style={styles.eventsList}>
            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map((event, index) => (
                <TouchableOpacity onPress={() => handleGoEventDetails(event)} key={event.id}>
                  <View
                    style={[styles.eventCard, { borderLeftColor: getEventColor(index) }]}>
                    <View style={styles.eventDetails}>
                      <Text style={styles.eventTitle}>
                        {event.eventName || 'Evento sem título'}
                      </Text>
                      <Text style={styles.eventTime}>
                        {formatEventTime(event.startsAt, event.endsAt)}
                      </Text>
                      {event.description && (
                        <Text style={styles.eventDescription} numberOfLines={1}>
                          {event.description}
                        </Text>
                      )}
                    </View>
                    <View style={styles.eventRightContent}>
                      {/* Você pode adicionar avatars ou botão play aqui se necessário */}
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noEventsContainer}>
                <Text style={styles.noEventsText}>Nenhum evento para esta data</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <CustomTabBar />
    </SafeAreaView>
  );
};

// --- Folha de Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    width: 32,
    height: 32,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  dateButton: {
    width: 64,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    marginRight: 12,
  },
  dateButtonActive: {
    backgroundColor: '#3B82F6',
    transform: [{ scale: 1.05 }],
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  dateDay: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
    color: '#4B5563',
  },
  dateTextActive: {
    color: 'white',
  },
  todayContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  eventsList: {
    gap: 12,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  eventDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  eventRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  noEventsContainer: {
    padding: 24,
    alignItems: 'center',
  },
  noEventsText: {
    fontSize: 16,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  avatarStack: {
    flexDirection: 'row',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'white',
    marginLeft: -10,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default ScheduleScreen;