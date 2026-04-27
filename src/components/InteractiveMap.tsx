import { useRef, useState, useEffect } from 'react'
import { MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export type MapPoint = {
  id: string
  numero_ponto: string
  lat: number
  lng: number
  tipo?: string
  valor?: number
}

interface MapProps {
  points: MapPoint[]
  onMapClick: (lat: number, lng: number) => void
  onMarkerDrag: (id: string, lat: number, lng: number) => void
  onClear: () => void
}

export function InteractiveMap({ points, onMapClick, onMarkerDrag, onClear }: MapProps) {
  const [loading, setLoading] = useState(true)
  const mapRef = useRef<HTMLDivElement>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const getCoords = (e: React.PointerEvent) => {
    if (!mapRef.current) return null
    const rect = mapRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height))
    // Map arbitrary bounds for the mock functionality
    return {
      lat: -23.5 + (y / rect.height) * (-23.6 - -23.5),
      lng: -46.7 + (x / rect.width) * (-46.5 - -46.7),
    }
  }

  if (loading) return <Skeleton className="w-full h-full rounded-xl" />

  return (
    <div
      ref={mapRef}
      className="relative w-full h-full rounded-xl overflow-hidden border bg-muted select-none touch-none shadow-inner"
      onPointerDown={(e) => {
        const c = getCoords(e)
        if (c && !draggingId) onMapClick(c.lat, c.lng)
      }}
      onPointerMove={(e) => {
        if (!draggingId) return
        const c = getCoords(e)
        if (c) onMarkerDrag(draggingId, c.lat, c.lng)
      }}
      onPointerUp={() => setDraggingId(null)}
      onPointerLeave={() => setDraggingId(null)}
    >
      <img
        src="https://img.usecurling.com/p/1200/800?q=satellite%20map&color=gray"
        alt="Map Background"
        className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
      />

      {points.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-background/95 px-5 py-2.5 rounded-full shadow-md text-sm font-medium animate-fade-in text-foreground">
            Clique no mapa para adicionar pontos de instalação
          </div>
        </div>
      )}

      {points.map((p) => {
        const isValid = Boolean(p.tipo) && p.valor !== undefined && p.valor >= 0
        const top = `${Math.max(0, Math.min(100, ((p.lat - -23.5) / (-23.6 - -23.5)) * 100))}%`
        const left = `${Math.max(0, Math.min(100, ((p.lng - -46.7) / (-46.5 - -46.7)) * 100))}%`

        return (
          <div
            key={p.id}
            className={cn(
              'absolute -translate-x-1/2 -translate-y-full cursor-grab active:cursor-grabbing flex flex-col items-center group',
              draggingId === p.id && 'z-10 scale-110 transition-transform',
            )}
            style={{ top, left }}
            onPointerDown={(e) => {
              e.stopPropagation()
              setDraggingId(p.id)
              e.currentTarget.setPointerCapture(e.pointerId)
            }}
            onPointerUp={(e) => {
              e.currentTarget.releasePointerCapture(e.pointerId)
              setDraggingId(null)
            }}
          >
            <div className="bg-background shadow-md rounded px-1.5 py-0.5 text-xs font-bold mb-1 border">
              {p.numero_ponto}
            </div>
            <MapPin
              className={cn(
                'h-8 w-8 drop-shadow-md',
                isValid ? 'text-green-600 fill-green-600/30' : 'text-red-500 fill-red-500/30',
              )}
            />
          </div>
        )
      })}

      <Button
        size="sm"
        variant="secondary"
        className="absolute bottom-4 right-4 shadow-md z-10"
        onClick={(e) => {
          e.stopPropagation()
          onClear()
        }}
        disabled={points.length === 0}
      >
        Limpar Mapa
      </Button>
    </div>
  )
}
