import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Tag, 
  Plus, 
  CheckCircle,
  AlertCircle,
  Trophy,
  Filter,
  Users
} from 'lucide-react';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  venue: string;
  category: 'training' | 'exam' | 'activity';
  description: string;
  coordinator?: string;
}

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: 'Practical on High-Density Apple Canopy Management',
    date: '2026-09-18',
    time: '10:30 AM - 01:00 PM',
    venue: 'Block C Orchard, ETC Malangpora',
    category: 'training',
    description: 'Hands-on training covering pruning, central leader system modeling, and support structures for high-density trellis layouts.',
    coordinator: 'Dr. Showkat Ali (Horticulture Specialist)'
  },
  {
    id: 'ev-2',
    title: 'Mid-Term Theory Exam (BHT-11 & BAT-11)',
    date: '2026-09-22',
    time: '11:00 AM - 01:30 PM',
    venue: 'Academic Hall A',
    category: 'exam',
    description: 'Official Mid-Semester theory examinations for all registered BHT and BAT trainees.',
    coordinator: 'Prof. M. A. Malik (Controller of Exams)'
  },
  {
    id: 'ev-3',
    title: 'Soil Health & Fertilizer Calculator Workshop',
    date: '2026-09-25',
    time: '02:00 PM - 04:30 PM',
    venue: 'IT & Soil Science Lab',
    category: 'training',
    description: 'Interactive workshop on formulating customized soil nutrition profiles using state-of-the-art diagnostic kits.',
    coordinator: 'Dr. Farooq Ahmad'
  },
  {
    id: 'ev-4',
    title: 'Annual Apple Harvest & Grading Festival',
    date: '2026-09-28',
    time: '09:30 AM - 05:00 PM',
    venue: 'Main Exhibition Ground, Campus Pulwama',
    category: 'activity',
    description: 'Annual campus festival featuring grading contests, local growers meet, and modern packaging displays.',
    coordinator: 'ETC Director and Staff'
  },
  {
    id: 'ev-5',
    title: 'Seminar: Polyhouse Nursery Construction',
    date: '2026-10-05',
    time: '11:00 AM - 12:30 PM',
    venue: 'Seminar Hall, SKUAST Kashmir',
    category: 'training',
    description: 'Technical session on cost-effective polyhouse designs, ventilation systems, and mist chamber installations.',
    coordinator: 'Er. Bashir Ahmad'
  },
  {
    id: 'ev-6',
    title: 'Practical Viva-Voce: Plant Canopy Management',
    date: '2026-10-12',
    time: '10:00 AM - 04:00 PM',
    venue: 'ETC Main Nursery Block',
    category: 'exam',
    description: 'One-on-one practical viva-voce examination and field canopy inspection.',
    coordinator: 'Dr. Showkat Ali'
  },
  {
    id: 'ev-7',
    title: 'Campus Cleanliness & Plantation Drive',
    date: '2026-09-17',
    time: '09:00 AM - 12:00 PM',
    venue: 'ETC Main Gate to Orchard Path',
    category: 'activity',
    description: 'Voluntary plantation drive for student groups. Ornamental saplings will be planted across the main entrance.',
    coordinator: 'Student Coordinator Council'
  }
];

export const EventsCalendar: React.FC = () => {
  // We lock base year/month to September 2026 (matching system date of 2026-09)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 16)); // Sept is index 8
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(INITIAL_EVENTS[0]);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'training' | 'exam' | 'activity'>('all');
  
  // Custom event creation states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '2026-09-20',
    time: '11:00 AM - 12:30 PM',
    venue: 'ETC Malangpora Orchard',
    category: 'training' as 'training' | 'exam' | 'activity',
    description: '',
    coordinator: ''
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Calendar calculations
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const prevDaysInMonth = new Date(year, month, 0).getDate();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.description) {
      alert('Please fill out all mandatory fields.');
      return;
    }

    const created: CalendarEvent = {
      id: `custom-ev-${Date.now()}`,
      ...newEvent
    };

    setEvents(prev => [created, ...prev]);
    setSelectedEvent(created);
    setShowAddForm(false);
    // Reset form fields
    setNewEvent({
      title: '',
      date: '2026-09-20',
      time: '11:00 AM - 12:30 PM',
      venue: 'ETC Malangpora Orchard',
      category: 'training',
      description: '',
      coordinator: ''
    });
  };

  // Build dates grid array
  const calendarCells: { dayNum: number; isCurrentMonth: boolean; dateString: string }[] = [];

  // Previous Month's padded days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = prevDaysInMonth - i;
    const prevMonthStr = String(month === 0 ? 11 : month - 1).padStart(2, '0');
    const prevYearStr = String(month === 0 ? year - 1 : year);
    calendarCells.push({
      dayNum: d,
      isCurrentMonth: false,
      dateString: `${prevYearStr}-${prevMonthStr}-${String(d).padStart(2, '0')}`
    });
  }

  // Active Month days
  for (let i = 1; i <= daysInMonth; i++) {
    const monthStr = String(month + 1).padStart(2, '0');
    calendarCells.push({
      dayNum: i,
      isCurrentMonth: true,
      dateString: `${year}-${monthStr}-${String(i).padStart(2, '0')}`
    });
  }

  // Remaining days to make a complete grid (multiple of 7, usually 35 or 42 cells)
  const totalCellsNeeded = calendarCells.length <= 35 ? 35 : 42;
  const nextMonthPads = totalCellsNeeded - calendarCells.length;
  for (let i = 1; i <= nextMonthPads; i++) {
    const nextMonthStr = String(month === 11 ? 0 : month + 1).padStart(2, '0');
    const nextYearStr = String(month === 11 ? year + 1 : year);
    calendarCells.push({
      dayNum: i,
      isCurrentMonth: false,
      dateString: `${nextYearStr}-${nextMonthStr}-${String(i).padStart(2, '0')}`
    });
  }

  // Helper to retrieve category label styling
  const getCategoryStyle = (cat: 'training' | 'exam' | 'activity') => {
    switch (cat) {
      case 'training':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-600',
          badge: 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-300'
        };
      case 'exam':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-200',
          dot: 'bg-red-600',
          badge: 'bg-rose-100 text-rose-950 font-bold border border-rose-300'
        };
      case 'activity':
        return {
          bg: 'bg-sky-50 text-sky-800 border-sky-200',
          dot: 'bg-sky-600',
          badge: 'bg-sky-100 text-sky-950 font-bold border border-sky-300'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald-800" />
            <span>Academic Events & Training Calendar</span>
          </h3>
          <p className="text-xs text-slate-500">
            Track upcoming examinations, orchard field practicals, admissions, and campus events.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Add Event Trigger */}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>{showAddForm ? 'View Calendar' : 'Schedule Event'}</span>
          </button>
        </div>
      </div>

      {showAddForm ? (
        /* Event Scheduler Form Panel */
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Plus className="w-5 h-5 text-emerald-800" />
            <h4 className="font-extrabold text-sm text-slate-900">Schedule Custom Campus Event</h4>
          </div>

          <form onSubmit={handleAddEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-slate-700 font-bold text-[11px]">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newEvent.title}
                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="e.g. Grafting Demonstration Exam"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-800"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-slate-700 font-bold text-[11px]">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={newEvent.category}
                onChange={e => setNewEvent({ ...newEvent, category: e.target.value as any })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-800"
              >
                <option value="training">Training Session (Green)</option>
                <option value="exam">Examination Date (Amber/Red)</option>
                <option value="activity">Campus Activity / Holiday (Blue)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-slate-700 font-bold text-[11px]">
                Event Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={newEvent.date}
                onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-800"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-slate-700 font-bold text-[11px]">
                Timings
              </label>
              <input
                type="text"
                value={newEvent.time}
                onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                placeholder="e.g. 10:00 AM - 12:30 PM"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-800"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-slate-700 font-bold text-[11px]">
                Venue / Location
              </label>
              <input
                type="text"
                value={newEvent.venue}
                onChange={e => setNewEvent({ ...newEvent, venue: e.target.value })}
                placeholder="e.g. IT Lab, Main Campus"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-800"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-slate-700 font-bold text-[11px]">
                Coordinator
              </label>
              <input
                type="text"
                value={newEvent.coordinator}
                onChange={e => setNewEvent({ ...newEvent, coordinator: e.target.value })}
                placeholder="e.g. Dr. Showkat Ali"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-800"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="block text-slate-700 font-bold text-[11px]">
                Brief Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={newEvent.description}
                onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Describe the objective, eligibility, and mandatory material required..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-800"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl"
              >
                Confirm Schedule
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Real Interactive Calendar and Event List Split Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT 7 cols: Interactive Monthly Calendar Grid */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            
            {/* Calendar Month Selector & Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-extrabold text-sm sm:text-base text-slate-800 min-w-[120px] text-center">
                  {monthNames[month]} {year}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Category Legend & Filter Dropdown */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="all">All Event Types</option>
                  <option value="training">Training Only</option>
                  <option value="exam">Exams Only</option>
                  <option value="activity">Activities Only</option>
                </select>
              </div>
            </div>

            {/* Days of Week Row */}
            <div className="grid grid-cols-7 text-center font-bold text-slate-500 text-[10px] sm:text-[11px] uppercase tracking-wider">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            {/* Grid Cells (Interactive) */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {calendarCells.map((cell, idx) => {
                // Find all events falling on this date string
                const cellEvents = events.filter(e => e.date === cell.dateString);
                
                // Check if any events pass the category filter
                const activeFilteredEvents = cellEvents.filter(
                  e => categoryFilter === 'all' || e.category === categoryFilter
                );

                const hasEvents = activeFilteredEvents.length > 0;
                const isToday = cell.dateString === '2026-09-16'; // System date

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (hasEvents) {
                        setSelectedEvent(activeFilteredEvents[0]);
                      }
                    }}
                    className={`min-h-[50px] sm:min-h-[64px] p-1.5 rounded-xl border flex flex-col justify-between items-start transition-all relative ${
                      cell.isCurrentMonth 
                        ? 'bg-white border-slate-200 text-slate-800' 
                        : 'bg-slate-50/60 border-slate-100 text-slate-400'
                    } ${isToday ? 'ring-2 ring-emerald-800 font-extrabold bg-emerald-50/20' : ''} ${
                      hasEvents ? 'hover:bg-slate-50 border-slate-300' : 'cursor-default'
                    }`}
                  >
                    {/* Day number with subtle indicator */}
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-xs ${isToday ? 'text-emerald-950 font-black px-1.5 py-0.5 rounded-lg bg-emerald-100' : ''}`}>
                        {cell.dayNum}
                      </span>
                    </div>

                    {/* Dot visualizers for events in cell */}
                    {hasEvents && (
                      <div className="flex flex-wrap gap-1 mt-1 w-full overflow-hidden">
                        {activeFilteredEvents.slice(0, 3).map((e) => {
                          const style = getCategoryStyle(e.category);
                          return (
                            <span 
                              key={e.id} 
                              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${style.dot}`} 
                              title={e.title}
                            />
                          );
                        })}
                        {activeFilteredEvents.length > 3 && (
                          <span className="text-[8px] font-bold text-slate-500">+{activeFilteredEvents.length - 3}</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Colored Legends */}
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-slate-600 pt-3 border-t border-slate-100">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span>Training Sessions</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                <span>Examination Dates</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                <span>Campus Activities</span>
              </span>
            </div>
          </div>

          {/* RIGHT 5 cols: Details of Selected Event & Side List */}
          <div className="lg:col-span-5 space-y-4">
            {/* 1. Selected Event Detail Block */}
            {selectedEvent ? (
              <div className="bg-[#00482B] text-white rounded-2xl p-6 shadow-md border border-emerald-800 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
                  <span className={`text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md ${getCategoryStyle(selectedEvent.category).badge}`}>
                    {selectedEvent.category === 'training' ? 'Training Session' : selectedEvent.category === 'exam' ? 'Examination' : 'Campus Event'}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-200">
                    {selectedEvent.date}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-black text-amber-300 leading-snug">
                    {selectedEvent.title}
                  </h4>
                  <p className="text-xs text-emerald-100 leading-relaxed pt-1">
                    {selectedEvent.description}
                  </p>
                </div>

                <div className="space-y-2.5 text-xs font-medium border-t border-emerald-800/80 pt-4 text-emerald-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-mono">{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{selectedEvent.venue}</span>
                  </div>
                  {selectedEvent.coordinator && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Coordinator: <strong>{selectedEvent.coordinator}</strong></span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-slate-500 py-12">
                <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto stroke-1 mb-2 animate-bounce" />
                <h4 className="font-bold text-slate-700">No Event Selected</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                  Click on any highlighted calendar cell or choose from the list below to review full schedule details.
                </p>
              </div>
            )}

            {/* 2. Upcoming Events Scrollable List */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                All Scheduled Events ({events.filter(e => categoryFilter === 'all' || e.category === categoryFilter).length})
              </h4>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {events
                  .filter(e => categoryFilter === 'all' || e.category === categoryFilter)
                  .map((e) => {
                    const isSelected = selectedEvent?.id === e.id;
                    const style = getCategoryStyle(e.category);
                    return (
                      <button
                        key={e.id}
                        onClick={() => setSelectedEvent(e)}
                        className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-start gap-2.5 ${
                          isSelected 
                            ? 'bg-slate-50 border-emerald-800 shadow-sm' 
                            : 'bg-white border-slate-200 hover:bg-slate-50/50'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${style.dot}`} />
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <h5 className="font-bold text-slate-900 truncate leading-snug">
                            {e.title}
                          </h5>
                          <div className="flex items-center gap-2 text-[10.5px] text-slate-500 font-medium">
                            <span className="font-mono">{e.date}</span>
                            <span>•</span>
                            <span className="truncate">{e.venue}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
