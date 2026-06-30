import { useState } from 'react';
import { usePlanetaryEvents } from '../../hooks/usePlanetaryEvents';

export default function PlanetaryEventsPage() {
  const { events, loading, makeChoice } = usePlanetaryEvents();

  const handleMakeChoice = async (eventId: string, choiceId: string) => {
    const result = await makeChoice(eventId, choiceId);
    if (result.success) {
      alert('Choice made successfully! Effects applied.');
    } else {
      alert('Failed to make choice');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-xl">Loading Events...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Planetary Events</h1>
        <p className="text-gray-400">Random events affecting your colonies</p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <i className="ri-calendar-event-line text-6xl text-gray-600"></i>
          </div>
          <p className="text-gray-400 text-lg mb-2">No active events</p>
          <p className="text-gray-500 text-sm">Events will appear randomly on your planets</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{event.event_name}</h3>
                  <p className="text-gray-400 text-sm">
                    Ends in {Math.ceil((new Date(event.ends_at).getTime() - Date.now()) / (1000 * 60 * 60))} hours
                  </p>
                </div>
                <span className="px-3 py-1 bg-orange-900 text-orange-400 rounded-full text-xs font-semibold whitespace-nowrap">
                  Active
                </span>
              </div>

              <p className="text-gray-300 mb-6">{event.event_description}</p>

              {event.player_choice ? (
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <p className="text-green-400 font-semibold mb-2">Choice Made</p>
                  <p className="text-gray-400">You have already made your choice for this event.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-white font-semibold mb-3">Choose your response:</p>
                  {event.choices.map((choice: any) => (
                    <button
                      key={choice.id}
                      onClick={() => handleMakeChoice(event.id, choice.id)}
                      className="w-full px-4 py-3 bg-gray-900 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-all text-left cursor-pointer"
                    >
                      <div className="font-semibold mb-1">{choice.label}</div>
                      <div className="text-sm text-gray-400">
                        {Object.entries(choice.effect).map(([key, value]: [string, any]) => (
                          <span key={key} className="mr-3">
                            {key}: <span className={value > 0 ? 'text-green-400' : 'text-red-400'}>
                              {value > 0 ? '+' : ''}{value}
                            </span>
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
