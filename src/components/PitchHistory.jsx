import React from 'react';

const PitchHistory = ({ history }) => (
  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
    <h3 className="font-bold mb-2">Pitch History</h3>
    <div className="space-y-2">
      {history.map((pitch, i) => (
        <div key={i} className="text-sm">
          {pitch.pitch} ({pitch.velocity} mph) - {pitch.location} - {pitch.outcome}
        </div>
      ))}
    </div>
  </div>
);

export default PitchHistory;