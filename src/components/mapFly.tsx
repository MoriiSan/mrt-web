import { useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import { useEffect } from 'react';

interface LocationProps {
  station: any | null,
  zoom: number
}

const MapFly: React.FC<LocationProps> = ({ station }) => {
  const map = useMap();
  const flyDuration = 0.3;

  const fly = (location: LatLngExpression) => {
    map.flyTo(location, 14, {
      animate: true,
      duration: flyDuration
    })
  };
  const flyCenter = () => {
    map.flyTo([14.596325, 121.027794], 13, {
      animate: true,
      duration: flyDuration
    })
  };

  useEffect(() => {
    if (station) {
      fly(L.latLng(station.stationCoord[0], station.stationCoord[1]))
    } else {
      flyCenter()
    }
  }, [station])

  return null
}


export default MapFly;