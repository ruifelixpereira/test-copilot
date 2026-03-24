const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Sample event data
const events = [
  {
    id: 1,
    title: 'Team Standup',
    date: '2026-03-02',
    time: '09:00',
    description: 'Daily team sync',
    color: '#4fc3f7',
  },
  {
    id: 2,
    title: 'Product Demo',
    date: '2026-03-05',
    time: '14:00',
    description: 'Demo new features to stakeholders',
    color: '#a5d6a7',
  },
  {
    id: 3,
    title: 'Sprint Planning',
    date: '2026-03-09',
    time: '10:00',
    description: 'Plan tasks for next sprint',
    color: '#ce93d8',
  },
  {
    id: 4,
    title: 'Design Review',
    date: '2026-03-12',
    time: '11:00',
    description: 'Review UI mockups with design team',
    color: '#ffcc80',
  },
  {
    id: 5,
    title: 'Company All-Hands',
    date: '2026-03-16',
    time: '15:00',
    description: 'Monthly company-wide meeting',
    color: '#ef9a9a',
  },
  {
    id: 6,
    title: 'Code Review',
    date: '2026-03-18',
    time: '13:00',
    description: 'Review pull requests with the team',
    color: '#80cbc4',
  },
  {
    id: 7,
    title: 'Release Deployment',
    date: '2026-03-20',
    time: '08:00',
    description: 'Deploy v2.1.0 to production',
    color: '#f48fb1',
  },
  {
    id: 8,
    title: 'Architecture Workshop',
    date: '2026-03-23',
    time: '09:30',
    description: 'Discuss system architecture improvements',
    color: '#ffe082',
  },
  {
    id: 9,
    title: 'Retrospective',
    date: '2026-03-24',
    time: '16:00',
    description: 'Sprint retrospective meeting',
    color: '#bcaaa4',
  },
  {
    id: 10,
    title: 'Hackathon Kickoff',
    date: '2026-03-27',
    time: '09:00',
    description: 'Internal hackathon begins',
    color: '#80deea',
  },
  {
    id: 11,
    title: 'Client Meeting',
    date: '2026-03-30',
    time: '14:30',
    description: 'Quarterly review with client',
    color: '#b39ddb',
  },
  {
    id: 12,
    title: 'Tech Talk',
    date: '2026-04-02',
    time: '17:00',
    description: 'Lightning talks on new technologies',
    color: '#a5d6a7',
  },
  {
    id: 13,
    title: 'Security Audit',
    date: '2026-04-07',
    time: '10:00',
    description: 'Annual security audit review',
    color: '#ef9a9a',
  },
  {
    id: 14,
    title: 'UX Research Session',
    date: '2026-04-10',
    time: '13:00',
    description: 'User interviews and usability testing',
    color: '#ffcc80',
  },
  {
    id: 15,
    title: 'Q2 Planning',
    date: '2026-04-15',
    time: '09:00',
    description: 'Plan goals and roadmap for Q2',
    color: '#4fc3f7',
  },
];

app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to get all events
app.get('/api/events', (req, res) => {
  res.json(events);
});

// API endpoint to get events by month/year
app.get('/api/events/:year/:month', (req, res) => {
  const { year, month } = req.params;
  const filtered = events.filter((e) => {
    const [y, m] = e.date.split('-');
    return y === year && m === month.padStart(2, '0');
  });
  res.json(filtered);
});

app.listen(PORT, () => {
  console.log(`Calendar app running at http://localhost:${PORT}`);
});
