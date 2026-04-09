import { useEffect, useRef } from 'react'
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
      {/* Pulse ring for critical/high */}
      {sev.pulse && (
        <CircleMarker
          center={[conflict.lat, conflict.lng]}
          radius={radius + 8}
          pathOptions={{
            color: sev.color,
            fillColor: sev.color,
            fillOpacity: 0.1,
            weight: 1,
            opacity: 0.3,
            className: 'conflict-marker-pulse',
          }}
        />
      )}

      {/* Main marker */}
      <CircleMarker
        center={[conflict.lat, conflict.lng]}
        radius={isSelected ? radius + 3 : radius}
        pathOptions={{
          color: isSelected ? '#ffffff' : sev.color,
          fillColor: sev.color,
          fillOpacity: isSelected ? 0.9 : 0.6,
          weight: isSelected ? 2 : 1.5,
        }}
        eventHandlers={{
          click: () => onSelect(isSelected ? null : conflict),
        }}
      >
        <Popup maxWidth={320} minWidth={280}>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: sev.color }}
              />
              <span className="font-bold text-sm text-gray-100">{conflict.name}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span
                className="text-[10px] px-1.5 py-0.5 rounded font-mono uppercase"
                style={{
                  backgroundColor: sev.color + '20',
                  color: sev.color,
                }}
              >
                {sev.label}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-700/50 text-gray-400">
                {conflict.type}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-700/50 text-gray-400">
                {conflict.region}
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{conflict.description}</p>
            <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-gray-700/50">
              <div>
                <span className="text-gray-500">Casualties:</span>
                <div className="text-red-400 font-mono">{conflict.casualties}</div>
              </div>
              <div>
                <span className="text-gray-500">Displaced:</span>
                <div className="text-amber-400 font-mono">{conflict.displaced}</div>
              </div>
              <div>
                <span className="text-gray-500">Started:</span>
                <div className="text-gray-300 font-mono">{conflict.startDate}</div>
              </div>
              <div>
                <span className="text-gray-500">Updated:</span>
                <div className="text-emerald-400 font-mono">{conflict.lastUpdate}</div>
              </div>
            </div>
            <div className="text-[10px] text-gray-500">
              <span className="font-medium text-gray-400">Parties:</span>{' '}
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
    <div className="flex-1 rounded-xl overflow-hidden border border-gray-800/50 relative min-h-[400px] lg:min-h-[500px]">
      {/* Scan line overlay */}
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
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
      <div className="absolute bottom-4 left-4 z-20 bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 space-y-1.5">
        <div className="text-[9px] text-gray-500 font-mono uppercase tracking-wider mb-1">Severity</div>
        {Object.entries(severityConfig).map(([key, val]) => (
          <div key={key} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: val.color }}
            />
            <span className="text-[10px] text-gray-400">{val.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
