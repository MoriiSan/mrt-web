import { LatLngExpression } from "leaflet";

interface Station {
    stationName: string;
    stationCoord: Coordinate;
    stationConn: string[];
}

interface Coordinate {
    lat: number;
    lng: number;
}

export const haversine = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lng2 - lng1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
};

export const stationDistance = (stationCoord: Coordinate, stations: Station[]) => {
    if (stations.length === 0 || !stations) {
        return true;
    }

    for (const station of stations) {
        if (stationCoord.lat === station.stationCoord.lat && stationCoord.lng === station.stationCoord.lng) {
            continue;
        }
        const stationLat = Number(station.stationCoord.lat);
        const stationLng = Number(station.stationCoord.lng);
        const dist = haversine(stationCoord.lat, stationCoord.lng, stationLat, stationLng);

        if (dist <= 0.5) {
            return { station: station.stationName, distance: (dist * 1000).toFixed(2) };
        }
    }

    return true;
};

export function calculateCenter(
    src: number[],
    dest: number[]
): LatLngExpression {
    const lat1 = src[0];
    const lng1 = src[1];
    const lat2 = dest[0];
    const lng2 = dest[1];

    const centerLat = (lat1 + lat2) / 2;
    const centerLng = (lng1 + lng2) / 2;

    return [centerLat, centerLng];
}