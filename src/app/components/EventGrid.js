import { EventCard } from './EventCard';

export const EventGrid = ({ events, onAddToCalendar }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {events.map(event => (
      <EventCard
        key={event.id}
        event={event}
        onAddToCalendar={onAddToCalendar}
      />
    ))}
  </div>
);