'use client';

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FiltersPanel } from './components/FiltersPanel';
import { EventGrid } from './components/EventGrid';
import SearchBar from './components/SearchBar';

const mockEvents = [
  {
    id: "e1",
    createdAt: "2024-11-29T10:00:00Z",
    title: "Research Symposium",
    description: "Join us for a day of groundbreaking tech presentations",
    date: "2024-11-30",
    time: "9:00 AM - 5:00 PM",
    location: "Bahen Centre",
    department: "Computer Science",
    sourceUrl: "https://www.cs.toronto.edu/events/symposium2024",
    tags: ["AI", "Machine Learning", "Systems"],
    lastUpdated: "2024-11-29T10:00:00Z",
    status: "active"
  },
  {
    id: "e2", 
    createdAt: "2024-11-29T11:00:00Z",
    title: "Tech Career Fair",
    description: "Meet top tech companies hiring UofT students",
    date: "2024-12-01",
    time: "10:00 AM - 4:00 PM",
    location: "Myhal Centre",
    department: "Geographic Information Systems",
    sourceUrl: "https://engineering.utoronto.ca/careerfair",
    tags: ["Career", "Networking"],
    lastUpdated: "2024-11-29T11:00:00Z",
    status: "active"
  },
  {
    id: "e3",
    createdAt: "2024-11-29T12:00:00Z",
    title: "Hackathon",
    description: "Build cool projects with friends and win prizes",
    date: "2024-08-02",
    time: "9:00 AM - 9:00 PM",
    location: "Bahen Centre",
    department: "Computer Science",
    tags: ["AI", "Machine Learning", "Systems"],
    status: "past",
  },
  {
    id: "e4",
    createdAt: "2024-11-29T13:00:00Z",
    title: "Tech Talk",
    description: "Learn about the latest tech trends from industry experts",
    date: "2024-12-05",
    time: "6:00 PM - 8:00 PM",
    location: "Myhal Centre",
    department: "Geographic Information Systems",
    tags: ["AI", "Machine Learning", "Systems"],
    status: "active",
  },
  {
    id: "e5",
    createdAt: "2024-11-29T14:00:00Z",
    title: "Networking Event",
    description: "Meet and connect with fellow tech enthusiasts",
    date: "2024-12-10",
    time: "7:00 PM - 9:00 PM",
    location: "Bahen Centre",
    department: "Computer Science",
    tags: ["Networking"],
    status: "active",
  },
  {
    id: "e6",
    createdAt: "2024-11-29T15:00:00Z",
    title: "Panel Discussion",
    description: "Join industry leaders for a panel on tech innovation",
    date: "2024-12-15",
    time: "3:00 PM - 5:00 PM",
    location: "Myhal Centre",
    department: "Geographic Information Systems",
    tags: ["AI", "Machine Learning", "Systems"],
  },
  {
    id: "e7",
    createdAt: "2024-11-29T16:00:00Z",
    title: "Workshop",
    description: "Hands-on workshop on building web applications",
    date: "2024-12-20",
    time: "10:00 AM - 12:00 PM",
    location: "Bahen Centre",
    department: "Computer Science",
    tags: ["AI", "Machine Learning", "Systems"],
  },
  {
    id: "e8",
    createdAt: "2024-11-29T17:00:00Z",
    title: "Seminar", 
    description: "Seminar on the future of AI and its impact on society",
    date: "2024-12-25",
    time: "2:00 PM - 4:00 PM",
    location: "Myhal Centre",
    department: "Geographic Information Systems",
    tags: ["AI", "Machine Learning"]
  }
 ];


 const getEventStatus = (date, time) => {
  const [startTime, endTime] = time.split('-').map(t => t.trim());
  const eventDateTime = new Date(`${date} ${startTime || '00:00'}`);
  return eventDateTime > new Date() ? 'active' : 'past';
};

const getEventTimeDistance = (date, time) => {
  const [startTime, endTime] = time.split('-').map(t => t ? t.trim() : '00:00');
  const eventDateTime = new Date(`${date} ${startTime}`);
  const currentTime = new Date();
  const timeDiff = Math.abs(eventDateTime.getTime() - currentTime.getTime());
  return timeDiff;
};

 const ITEMS_PER_PAGE = 6;

 const EventDashboard = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
 
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // const response = await fetch('https://api.example.com/events');
        setEvents(mockEvents);
        setFilteredEvents(mockEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setEvents([]);
        setFilteredEvents([]);
      }
    };
    fetchEvents();
  }, []);
 
  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }


    if (selectedDepartments.length) {
      filtered = filtered.filter(event => selectedDepartments.includes(event.department));
    }
    
    if (selectedTags.length) {
      filtered = filtered.filter(event => 
        event.tags && event.tags.some(tag => selectedTags.includes(tag))
      );
    }

    filtered = filtered.filter(event => {
      const eventStatus = getEventStatus(event.date, event.time);
      return isActive ? eventStatus === 'active' : eventStatus === 'past';
    });

    filtered.sort((a, b) => {
      const aDistance = getEventTimeDistance(a.date, a.time);
      const bDistance = getEventTimeDistance(b.date, b.time);
      return aDistance - bDistance;
    });

    setFilteredEvents(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedDepartments, selectedTags, isActive, searchTerm, events]);
 
  // Pagination calculations
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);
 
  const Pagination = () => (
    <div className="flex justify-center gap-2 mt-6">
      <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded bg-blue-900 text-white disabled:bg-gray-300"
      >
        Previous
      </button>
      <span className="px-3 py-1">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded bg-blue-900 text-white disabled:bg-gray-300"
      >
        Next
      </button>
    </div>
  );
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="w-full md:w-2/3">
              <SearchBar onSearch={setSearchTerm} />
            </div>
            <button
              onClick={() => setIsActive(!isActive)}
              className={`px-6 py-3 rounded-lg transition-all duration-200 w-full md:w-auto
                ${isActive 
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' 
                  : 'bg-blue-900 hover:bg-blue-800 text-white'
                }`}
            >
              {isActive ? 'View Past Events' : 'View Upcoming Events'}
            </button>
          </div>
        </div>
   
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-4">
            <FiltersPanel
              selectedDepartments={selectedDepartments}
              setSelectedDepartments={setSelectedDepartments}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
          </div>
          
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {isActive ? 'Upcoming Events' : 'Past Events'}
                </h2>
                <p className="text-sm text-gray-500">
                  Showing {currentEvents.length} of {filteredEvents.length} events
                </p>
              </div>
              <EventGrid events={currentEvents} />
              {totalPages > 1 && <Pagination />}
            </div>
          </div>
        </div>
      </main>
    </div>
   );
 };

export default EventDashboard;