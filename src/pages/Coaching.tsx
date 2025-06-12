
import React, { useState } from 'react';
import { useCoaching } from '@/hooks/useCoaching';
import { useSubscription } from '@/hooks/useSubscription';
import BrutalistCard from '@/components/BrutalistCard';
import BrutalistButton from '@/components/BrutalistButton';
import BrutalistNavigation from '@/components/BrutalistNavigation';

const Coaching = () => {
  const { sessions, isLoading, bookSession, cancelSession } = useCoaching();
  const { isPremium } = useSubscription();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const handleBookSession = async () => {
    if (!selectedDate || !selectedTime) return;

    const sessionDate = new Date(`${selectedDate}T${selectedTime}`);
    const success = await bookSession(sessionDate);
    
    if (success) {
      setSelectedDate('');
      setSelectedTime('');
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-green-600';
      case 'completed': return 'text-blue-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (!isPremium) {
    return (
      <div className="brutalist-container pb-20">
        <div className="brutalist-header">
          <h1 className="brutalist-h1 text-center">1:1 COACHING</h1>
          <p className="text-center font-bold">PERSONALIZED SUCCESS STRATEGY</p>
        </div>

        <div className="brutalist-section">
          <BrutalistCard>
            <div className="text-center">
              <h2 className="brutalist-h2 mb-4">PREMIUM FEATURE</h2>
              <p className="text-lg mb-6">
                Upgrade to GRYT Pro to access 1:1 coaching sessions with our expert coaches.
              </p>
              
              <div className="bg-gray-100 p-4 rounded mb-6">
                <h3 className="font-bold mb-2">WHAT YOU GET:</h3>
                <ul className="text-left space-y-1">
                  <li>• 30-minute monthly video calls</li>
                  <li>• Custom goal strategy sessions</li>
                  <li>• Crisis intervention support</li>
                  <li>• Success amplification coaching</li>
                </ul>
              </div>

              <BrutalistButton variant="accent" className="w-full">
                UPGRADE TO ACCESS COACHING
              </BrutalistButton>
            </div>
          </BrutalistCard>
        </div>

        <BrutalistNavigation 
          items={[
            { label: 'DASHBOARD', path: '/', icon: '🏠' },
            { label: 'GOALS', path: '/create-goal', icon: '🎯' },
            { label: 'CONTENT', path: '/content', icon: '📚' },
            { label: 'COACHING', path: '/coaching', icon: '👨‍🏫' }
          ]}
        />
      </div>
    );
  }

  return (
    <div className="brutalist-container pb-20">
      <div className="brutalist-header">
        <h1 className="brutalist-h1 text-center">1:1 COACHING</h1>
        <p className="text-center font-bold">$49/MONTH • 30-MIN SESSIONS</p>
      </div>

      <div className="brutalist-section space-y-6">
        <BrutalistCard>
          <h2 className="brutalist-h2 mb-6 text-center">BOOK NEW SESSION</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block font-bold mb-2">SELECT DATE</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-brutalist-white text-brutalist-black border-4 border-brutalist-black px-4 py-3 text-lg font-bold focus:outline-none focus:border-brutalist-green"
              />
            </div>

            <div>
              <label className="block font-bold mb-2">SELECT TIME</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full bg-brutalist-white text-brutalist-black border-4 border-brutalist-black px-4 py-3 text-lg font-bold focus:outline-none focus:border-brutalist-green"
              >
                <option value="">Choose time...</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
              </select>
            </div>

            <BrutalistButton
              onClick={handleBookSession}
              disabled={!selectedDate || !selectedTime || isLoading}
              variant="accent"
              className="w-full"
            >
              {isLoading ? 'BOOKING...' : 'BOOK SESSION'}
            </BrutalistButton>
          </div>
        </BrutalistCard>

        <BrutalistCard>
          <h2 className="brutalist-h2 mb-6">YOUR SESSIONS</h2>
          
          {sessions.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-600">No sessions booked yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="border-2 border-gray-300 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">{formatDateTime(session.session_date)}</p>
                      <p className={`text-sm font-bold ${getStatusColor(session.status)}`}>
                        {session.status.toUpperCase()}
                      </p>
                      {session.zoom_link && session.status === 'scheduled' && (
                        <a
                          href={session.zoom_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-sm"
                        >
                          Join Session
                        </a>
                      )}
                    </div>
                    
                    {session.status === 'scheduled' && (
                      <BrutalistButton
                        variant="secondary"
                        onClick={() => cancelSession(session.id)}
                        disabled={isLoading}
                      >
                        CANCEL
                      </BrutalistButton>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </BrutalistCard>
      </div>

      <BrutalistNavigation 
        items={[
          { label: 'DASHBOARD', path: '/', icon: '🏠' },
          { label: 'GOALS', path: '/create-goal', icon: '🎯' },
          { label: 'CONTENT', path: '/content', icon: '📚' },
          { label: 'COACHING', path: '/coaching', icon: '👨‍🏫' }
        ]}
      />
    </div>
  );
};

export default Coaching;
