import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { severityConfig } from '../data/conflicts'
import 'leaflet/dist/leaflet.css'

function FlyToSelected({ selected }) {
  const map = useMap()
  useEffect(() => {
    if (selected) {
      map.flyTo([selected.lat, selected.lng], 5, { duration: 1.5 })
    }
  }, [selected, map])
  return null
}

function ConflictMarker({ conflict, isSelected, onSelect }) {
  const sev = severityConfig[conflict.severity]
  const radiusMap = { critical: 12, high: 10, medium: 8, low: 6, watchlist: 5 }
  const radius = radiusMap[conflict.severity] || 7

  return (
    <>
      {sev.pulse && (
        <CircleMarker
          center={[conflict.lat, conflict.lng]}
          radius={radius + 10}
          pathOptions={{
            color: sev.color,
            fillColor: sev.color,
            fillOpacity: 0.08,
            weight: 1,
            opacity: 0.25,
            className: 'conflict-marker-pulse',
          }}
        />
      )}

      <CircleMarker
        center={[conflict.lat, conflict.lng]}
        radius={isSelected ? radius + 4 : radius}
        pathOptions={{
          color: isSelected ? '#22d3ee' : sev.color,
          fillColor: sev.color,
          fillOpacity: isSelected ? 0.9 : 0.55,
          weight: isSelected ? 2.5 : 1.5,
        }}
        eventHandlers={{
          click: () => onSelect(isSelected ? null : conflict),
        }}
      >
        <Popup maxWidth={320} minWidth={280}>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full shadow-lg"
                style={{ backgroundColor: sev.color, boxShadow: `0 0 8px ${sev.color}60` }}
              />
              <span className="font-bold text-sm text-slate-100">{conflict.name}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-md font-mono uppercase font-medium"
                style={{
                  backgroundColor: sev.color + '20',
                  color: sev.color,
                  border: `1px solid ${sev.color}30`,
                }}
              >
                {sev.label}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-700/50 text-slate-400 border border-slate-600/30">
                {conflict.type}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-700/50 text-slate-400 border border-slate-600/30">
                {conflict.region}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{conflict.description}</p>
            <div className="grid grid-cols-2 gap-2 text-[10px] pt-2 border-t border-slate-700/50">
              <div>
                <span className="text-slate-500">Casualties:</span>
                <div className="font-mono font-medium" style={{ color: '#ff4757' }}>{conflict.casualties}</div>
              </div>
              <div>
                <span className="text-slate-500">Displaced:</span>
                <div className="font-mono font-medium" style={{ color: '#ffa502' }}>{conflict.displaced}</div>
              </div>
              <div>
                <span className="text-slate-500">Started:</span>
                <div className="text-slate-300 font-mono">{conflict.startDate}</div>
              </div>
              <div>
                <span className="text-slate-500">Updated:</span>
                <div className="text-cyan-400 font-mono">{conflict.lastUpdate}</div>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 pt-1">
              <span className="font-medium text-slate-400">Parties:</span>{' '}
              {conflict.parties.join(' vs ')}
            </div>
          </div>
        </Popup>
      </CircleMarker>
    </>
  )
}

export default function ConflictMap({ conflicts, selected, onSelect }) {
  return (
    <div className="flex-1 rounded-xl overflow-hidden border border-slate-700/30 relative min-h-[400px] lg:min-h-[500px] shadow-2xl shadow-black/20">
      <div className="absolute inset-0 pointer-events-none z-10 scan-line" />

      <MapContainer
        center={[20, 30]}
        zoom={2.5}
        minZoom={2}
        maxZoom={12}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        attributionControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <FlyToSelected selected={selected} />
        {conflicts.map(conflict => (
          <ConflictMarker
            key={conflict.id}
            conflict={conflict}
            isSelected={selected?.id === conflict.id}
            onSelect={onSelect}
          />
        ))}
      </MapContainer>

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 z-20 glass rounded-lg p-3 space-y-1.5">
        <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wider mb-1">Severity</div>
        {Object.entries(severityConfig).map(([key, val]) => (
          <div key={key} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: val.color, boxShadow: `0 0 6px ${val.color}40` }}
            />
            <span className="text-[10px] text-slate-400">{val.label}</span>
          </div>
        ))}
      </div>

      {/* Conflict count badge */}
      <div className="absolute top-4 right-4 z-20 glass rounded-lg px-3 py-1.5">
        <span className="text-xs font-mono text-slate-400">
          <span className="text-cyan-400 font-medium">{conflicts.length}</span> zones tracked
        </span>
      </div>
    </div>
  )
}
