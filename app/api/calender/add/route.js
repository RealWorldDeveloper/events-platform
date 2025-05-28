import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { event, token } = await request.json();

  try {
    // Validate input
    if (!event || !token || !event.date || !event.startTime || !event.endTime) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Helper function to parse date and time
    const parseDateTime = (dateStr, timeStr) => {
      // Combine date and time (assuming date is YYYY-MM-DD and time is HH:MM)
      const [year, month, day] = dateStr.split('-');
      const [hours, minutes] = timeStr.split(':');
      
      // Create date in UTC to avoid timezone issues, then convert to London time
      const date = new Date(Date.UTC(
        parseInt(year),
        parseInt(month) - 1, // months are 0-indexed
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
      ));
      
      return date;
    };

    // Parse dates
    const startDate = parseDateTime(event.date, event.startTime);
    const endDate = parseDateTime(event.date, event.endTime);

    // Check if dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { success: false, message: 'Invalid date/time format' },
        { status: 400 }
      );
    }

    // Check if end time is after start time
    if (endDate <= startDate) {
      return NextResponse.json(
        { success: false, message: 'End time must be after start time' },
        { status: 400 }
      );
    }

    // Initialize Google Calendar API
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: token });
    const calendar = google.calendar({ version: 'v3', auth });

    // Check for existing events
    const existingEvents = await calendar.events.list({
      calendarId: "primary",
      q: event.title,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
    });

    if (existingEvents.data.items?.length > 0) {
      return NextResponse.json(
        { success: false, message: "Event already exists in Google Calendar" },
        { status: 400 }
      );
    }

    // Create new event
    const newEvent = {
      summary: event.title,
      description: event.description,
      location: event.location,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'Europe/London',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'Europe/London',
      },
    };

    // Insert event
    const createdEvent = await calendar.events.insert({
      calendarId: 'primary',
      resource: newEvent,
    });

    return NextResponse.json({
      success: true,
      message: 'Event added to Google Calendar successfully',
      eventId: createdEvent.data.id,
    });

  } catch (error) {
    console.error('Google Calendar API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to add event to Google Calendar',
        error: error.message 
      },
      { status: 500 }
    );
  }
}