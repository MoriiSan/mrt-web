import { useMapEvents } from 'react-leaflet';
import { LatLngLiteral } from 'leaflet';

interface MapEventHandlerProps {
    onDoubleClick?: (latlng: LatLngLiteral) => void;
}

const GetLatLng: React.FC<MapEventHandlerProps> = ({ onDoubleClick }) => {
    useMapEvents({
        dblclick: (e) => {
            if (onDoubleClick) {
                onDoubleClick(e.latlng);
            }
        },
    });

    return null;
};

export default GetLatLng;
