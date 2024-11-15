import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const BatterAnalysis = ({ batter }) => (
  <div className="mb-6 p-4 bg-white rounded-lg shadow">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="text-lg font-bold mb-2">{batter.name}</h3>
        <div className="space-y-1">
          <p>Bats: {batter.bats} | AVG: {batter.avg}</p>
          <p>SLG: {batter.slugging} | OPS: {batter.ops}</p>
        </div>
      </div>
      <div className="border-l pl-4">
        <h4 className="font-bold mb-1">Hot Zones</h4>
        <div className="grid grid-cols-3 gap-1">
          {Object.entries(batter.zones).map(([zone, value]) => (
            <div 
              key={zone} 
              className={`p-1 text-xs rounded ${
                parseFloat(value) > 0.300 
                  ? 'bg-red-100' 
                  : 'bg-green-100'
              }`}
            >
              {zone.replace('_', ' ')}: {value}
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="mt-4">
      <h4 className="font-bold mb-2">Pitch Type Performance</h4>
      <BarChart width={350} height={100} data={[
        { name: 'Fastball', value: parseFloat(batter.pitchTypes.fastball) },
        { name: 'Breaking', value: parseFloat(batter.pitchTypes.breaking) },
        { name: 'Offspeed', value: parseFloat(batter.pitchTypes.offspeed) }
      ]}>
        <XAxis dataKey="name" />
        <YAxis domain={[0, 0.400]} />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </div>

    <div className="mt-4">
      <h4 className="font-bold mb-2">Scouting Notes</h4>
      <pre className="text-sm whitespace-pre-wrap bg-gray-50 p-2 rounded">
        {batter.notes}
      </pre>
    </div>
  </div>
);

export default BatterAnalysis;