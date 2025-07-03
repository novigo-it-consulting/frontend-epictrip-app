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

const ScheduleScreen = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const generateWeekDates = () => {
      const today = new Date();
      const currentDay = today.getDay(); // 0 = Domingo
      const weekDates = [];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      for (let i = 0; i < 7; i++) {
        // Gerar 7 dias para a semana completa
        const date = new Date(today);
        date.setDate(today.getDate() - currentDay + i);

        weekDates.push({
          day: dayNames[date.getDay()],
          date: date.getDate(),
          fullDate: new Date(date),
        });
      }
      setDates(weekDates);
    };

    generateWeekDates();
  }, []);

  const events = [
    {
      id: 1,
      title: 'Breakfast',
      time: '10:00am - 1:00pm',
      color: '#475569', // Cor do slate-600
      hasPlayButton: true,
      avatars: [],
    },
    {
      id: 2,
      title: 'Running with friends',
      time: '1:00pm - 3:00pm',
      color: '#3B82F6', // Cor do blue-500
      hasPlayButton: false,
      avatars: [
        'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      ],
    },
    {
      id: 3,
      title: 'Lunch with bro',
      time: '2:00pm - 4:00pm',
      color: '#8B5CF6', // Cor do purple-500
      hasPlayButton: false,
      avatars: [
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      ],
    },
  ];

  const isSameDate = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const handleGoCreateNewEvent = () => {
    navigation.navigate('CreateNewEvent')
  }

  const handleGoEventDetails = (eventId) => {
    navigation.navigate("EventDetails", { eventId })
  }

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
          <Text style={styles.sectionTitle}>Today</Text>
          <View style={styles.eventsList}>
            {events.map(event => (
              <TouchableOpacity onPress={() => handleGoEventDetails(event.id)} key={event.id}>
                <View
                  style={[styles.eventCard, { borderLeftColor: '#3B82F6' }]}>
                  <View style={styles.eventDetails}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventTime}>{event.time}</Text>
                  </View>
                  <View style={styles.eventRightContent}>
                    {/* {event.avatars.length > 0 && (
                    <View style={styles.avatarStack}>
                      {event.avatars.map((avatar, index) => (
                        <Image
                          key={index}
                          source={{ uri: avatar }}
                          style={styles.avatar}
                        />
                      ))}
                    </View>
                  )} */}
                    {/* {event.hasPlayButton && (
                    <TouchableOpacity style={styles.playButton}>
                      <Play
                        size={16}
                        color="#374151"
                        fill="currentColor"
                        style={{ marginLeft: 1 }}
                      />
                    </TouchableOpacity>
                  )} */}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
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
  eventRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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