/* app.js – Calendar front-end logic */
(function () {
  'use strict';

  let allEvents = [];
  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth(); // 0-indexed
  let selectedDate = null;

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // ---- Fetch all events once ----
  async function fetchEvents() {
    try {
      const res = await fetch('/api/events');
      allEvents = await res.json();
    } catch (err) {
      console.error('Failed to load events:', err);
      allEvents = [];
    }
    renderCalendar();
    renderEventsSidebar(null);
  }

  // ---- Build a date string YYYY-MM-DD ----
  function toDateStr(year, month, day) {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  }

  // ---- Events for a specific date string ----
  function eventsForDate(dateStr) {
    return allEvents.filter((e) => e.date === dateStr);
  }

  // ---- Render the calendar grid ----
  function renderCalendar() {
    document.getElementById('month-label').textContent =
      `${MONTH_NAMES[currentMonth]} ${currentYear}`;

    const body = document.getElementById('calendar-body');
    body.innerHTML = '';

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrev = new Date(currentYear, currentMonth, 0).getDate();

    // cells before the 1st
    for (let i = 0; i < firstDay; i++) {
      const day = daysInPrev - firstDay + 1 + i;
      body.appendChild(makeCell(day, currentYear, currentMonth - 1, true));
    }

    // cells for this month
    for (let d = 1; d <= daysInMonth; d++) {
      body.appendChild(makeCell(d, currentYear, currentMonth, false));
    }

    // fill trailing cells
    const total = firstDay + daysInMonth;
    const trailing = total % 7 === 0 ? 0 : 7 - (total % 7);
    for (let i = 1; i <= trailing; i++) {
      body.appendChild(makeCell(i, currentYear, currentMonth + 1, true));
    }
  }

  function makeCell(day, year, month, otherMonth) {
    const cell = document.createElement('div');
    cell.className = 'cal-cell' + (otherMonth ? ' other-month' : '');

    const dateStr = toDateStr(year, month, day);
    const cellDate = new Date(year, month, day);
    cellDate.setHours(0, 0, 0, 0);

    if (!otherMonth && cellDate.getTime() === today.getTime()) {
      cell.classList.add('today');
    }
    if (!otherMonth && dateStr === selectedDate) {
      cell.classList.add('selected');
    }

    // day number
    const dayEl = document.createElement('div');
    dayEl.className = 'cell-day';
    dayEl.textContent = day;
    cell.appendChild(dayEl);

    // event dots
    if (!otherMonth) {
      const dayEvents = eventsForDate(dateStr);
      const dotsContainer = document.createElement('div');
      dotsContainer.className = 'cell-events';

      const maxVisible = 2;
      dayEvents.slice(0, maxVisible).forEach((ev) => {
        const dot = document.createElement('div');
        dot.className = 'event-dot';
        dot.style.backgroundColor = ev.color;
        dot.textContent = ev.title;
        dotsContainer.appendChild(dot);
      });

      if (dayEvents.length > maxVisible) {
        const more = document.createElement('div');
        more.className = 'event-more';
        more.textContent = `+${dayEvents.length - maxVisible} more`;
        dotsContainer.appendChild(more);
      }

      cell.appendChild(dotsContainer);

      cell.addEventListener('click', () => {
        selectedDate = dateStr;
        renderCalendar();
        renderEventsSidebar(dateStr);
      });
    }

    return cell;
  }

  // ---- Render sidebar ----
  function renderEventsSidebar(dateStr) {
    const title = document.getElementById('events-panel-title');
    const list = document.getElementById('events-list');
    list.innerHTML = '';

    let events;
    if (dateStr) {
      const d = new Date(dateStr + 'T00:00:00');
      const label = d.toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric',
      });
      title.textContent = label;
      events = eventsForDate(dateStr);
    } else {
      title.textContent = 'Upcoming Events';
      const nowStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());
      events = allEvents
        .filter((e) => e.date >= nowStr)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 10);
    }

    if (events.length === 0) {
      const msg = document.createElement('p');
      msg.className = 'no-events';
      msg.textContent = dateStr ? 'No events on this day.' : 'No upcoming events.';
      list.appendChild(msg);
      return;
    }

    events.forEach((ev) => {
      const card = document.createElement('div');
      card.className = 'event-card';
      card.style.borderLeftColor = ev.color;

      const header = document.createElement('div');
      header.className = 'event-card-header';

      const titleEl = document.createElement('div');
      titleEl.className = 'event-card-title';
      titleEl.textContent = ev.title;

      const timeEl = document.createElement('div');
      timeEl.className = 'event-card-time';
      timeEl.textContent = formatTime(ev.time);

      header.appendChild(titleEl);
      header.appendChild(timeEl);

      if (!dateStr) {
        const dateEl = document.createElement('div');
        dateEl.className = 'event-card-date';
        const d = new Date(ev.date + 'T00:00:00');
        dateEl.textContent = d.toLocaleDateString('en-US', {
          weekday: 'short', month: 'short', day: 'numeric',
        });
        card.appendChild(header);
        card.appendChild(dateEl);
      } else {
        card.appendChild(header);
      }

      if (ev.description) {
        const descEl = document.createElement('div');
        descEl.className = 'event-card-desc';
        descEl.textContent = ev.description;
        card.appendChild(descEl);
      }

      list.appendChild(card);
    });
  }

  function formatTime(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${period}`;
  }

  // ---- Navigation ----
  document.getElementById('prev-month').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    selectedDate = null;
    renderCalendar();
    renderEventsSidebar(null);
  });

  document.getElementById('next-month').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    selectedDate = null;
    renderCalendar();
    renderEventsSidebar(null);
  });

  // ---- Boot ----
  fetchEvents();
})();
