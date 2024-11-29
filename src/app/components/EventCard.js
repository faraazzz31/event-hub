import { useState } from 'react';
import { Calendar, MapPin, Clock, CalendarIcon } from 'lucide-react';

const getEventStatus = (date, time) => {
    const [startTime] = time.split('-').map(t => t.trim());
    const eventDateTime = new Date(`${date} ${startTime}`);
    return eventDateTime > new Date() ? 'Active' : 'Past';
};

const handleSyncToCalendar = () => {
    alert('Syncing to calendar...');
};

export const EventCard = ({ event }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const status = getEventStatus(event.date, event.time);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{event.title}</h3>
          <div className="text-sm text-gray-500">{event.department}</div>
        </div>
        <span className={`px-2 py-1 rounded text-sm ${
          status === 'Active' ? 'bg-green-100 text-green-800' :
          status === 'Past' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {status}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={16} className="text-gray-500" />
          <span>{event.date}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock size={16} className="text-gray-500" />
          <span>{event.time}</span>
        </div>

        <div className="flex items-start gap-2 text-sm">
          <MapPin size={16} className="text-gray-500 mt-1" />
          <div>
            {typeof event.location === 'string' ? (
              <div className="font-medium">{event.location}</div>
            ) : (
              <>
                <div className="font-medium">{event.location?.building}</div>
                {event.location?.room && (
                  <div>Room: {event.location.room}</div>
                )}
                {event.location?.address && (
                  <div className="text-gray-500">{event.location.address}</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className={`mt-4 ${isExpanded ? '' : 'line-clamp-2'}`}>
        <p className="text-sm text-gray-600">{event.description}</p>
      </div>

      {event.description.length > 100 && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-blue-600 text-sm hover:underline"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {event.tags?.map(tag => (
          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
            #{tag}
          </span>
        ))}
      </div>

      <button
        onClick={handleSyncToCalendar}
        className="mt-4 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm flex items-center gap-2"
      >
        <CalendarIcon size={16} />
        <span>Sync to Calendar</span>
      </button>

    </div>
  );
};