import React from 'react';

const ZoneSelection = ({ batter, onSelect }) => (
  <div className="grid grid-cols-3 gap-1 mb-4">
    {Object.entries(batter.zones).map(([zone, value]) => (
      <button
        key={zone}
        onClick={() => onSelect(zone)}
        className={`p-2 rounded transition ${
          parseFloat(value) > 0.300
            ? 'bg-red-100 hover:bg-red-200'
            : 'bg-green-100 hover:bg-green-200'
        }`}
      >
        <div className="text-sm font-bold">{zone.replace('_', ' ').toUpperCase()}</div>
        <div className="text-xs">{value}</div>
      </button>
    ))}
  </div>
);

export default ZoneSelection;