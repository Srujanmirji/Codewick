// Simulated delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface Session {
  id: string;
  skill: string;
  partnerName: string;
  date: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
}

export interface Activity {
  id: string;
  type: 'session' | 'rating' | 'dispute' | 'credit';
  description: string;
  time: string;
}

export interface Dispute {
  id: string;
  title: string;
  status: 'Pending' | 'Resolved';
}

export const fetchDashboardData = async () => {
  await delay(1500); // Simulate network latency

  return {
    sessions: [
      { id: '1', skill: 'React Mentoring', partnerName: 'Sarah Jenkins', date: '2026-05-06T14:00:00Z', status: 'Upcoming' },
      { id: '2', skill: 'UI Design Review', partnerName: 'Michael Chen', date: '2026-05-07T10:00:00Z', status: 'Upcoming' },
    ] as Session[],
    activities: [
      { id: '1', type: 'session', description: 'Completed "Python Basics" session', time: '2 hours ago' },
      { id: '2', type: 'credit', description: 'Earned 2 Time Credits', time: '2 hours ago' },
      { id: '3', type: 'rating', description: 'Received a 5-star rating from David', time: '1 day ago' },
    ] as Activity[],
    disputes: [
      { id: '1', title: 'No-show for "SEO Audit"', status: 'Pending' },
    ] as Dispute[],
    performance: [
      { name: 'Mon', sessions: 1, credits: 2 },
      { name: 'Tue', sessions: 2, credits: 4 },
      { name: 'Wed', sessions: 0, credits: 0 },
      { name: 'Thu', sessions: 3, credits: 6 },
      { name: 'Fri', sessions: 1, credits: 2 },
      { name: 'Sat', sessions: 0, credits: 0 },
      { name: 'Sun', sessions: 4, credits: 8 },
    ],
    walletHistory: [
      { name: 'Week 1', earned: 5, spent: 2 },
      { name: 'Week 2', earned: 8, spent: 4 },
      { name: 'Week 3', earned: 4, spent: 6 },
      { name: 'Week 4', earned: 12, spent: 5 },
    ]
  };
};
