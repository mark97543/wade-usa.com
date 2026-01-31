/**
 * FamilyCalendar Component
 * * Logic:
 * 1. Retrieves 'directus_auth_token' from localStorage.
 * 2. Parses the JSON string to extract the 'access_token'.
 * 3. Fetches events from the Directus 'events' collection.
 * 4. Maps Directus fields (title, start, end, color) to FullCalendar's event object format.
 * 5. Uses dayGrid (Month) and timeGrid (Week/Day) plugins for multiple views.
 * * Directus Collection Requirements:
 * - Collection Name: 'events'
 * - Fields: title (String), start (Datetime), end (Datetime), all_day (Boolean), color (String)
 */

import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import styles from './FamilyCalendar.module.css'

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay: boolean;
  backgroundColor: string;
  borderColor: string;
}

const FamilyCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // 1. Use the EXACT verified key name
      const rawAuth = localStorage.getItem('directus_auth_data');
      
      if (!rawAuth) {
        console.warn("Waiting for auth data...");
        // If it's null, we retry once after a short delay
        setTimeout(fetchEvents, 1000);
        return;
      }

      const authData = JSON.parse(rawAuth);
      const token = authData.access_token;

      if (!token) throw new Error("Access token missing from auth data");

      const response = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/items/events`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);

      const result = await response.json();

      const formattedEvents = result.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        start: item.start,
        end: item.end,
        allDay: item.all_day,
        backgroundColor: item.color || '#3788d8',
        borderColor: item.color || '#3788d8',
      }));

      console.log("✅ Success! Events loaded:", formattedEvents);
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Calendar Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Syncing Family Calendar...</div>;

  return (
    <div className={styles.calendarContainer}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek'
        }}
        events={events}
        height="auto"
        // Ensure buttons look clean
        buttonText={{
          today: 'Today',
          month: 'Month',
          week: 'Week'
        }}
      />
    </div>
  );
};

export default FamilyCalendar;



const calendarStyles = `
  .fc { 
    background: white;
    padding: 10px;
    border-radius: 8px;
  }
  .fc .fc-button-primary {
    background-color: #4f46e5;
    border-color: #4f46e5;
  }
  .dark .fc {
    background: #1e293b;
    color: white;
  }
`;