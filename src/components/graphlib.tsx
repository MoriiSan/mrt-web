import graphlib from "graphlib";
// import { haversine } from "./calcDistance";

interface Station {
    id(id: any): string;
    stationName: string;
    stationCoord: [number, number];
    stationConn: string[];
}

function dfs(
    current: string,
    destination: string,
    visited: Set<string>,
    graph: graphlib.Graph
): { maxLength: number; path: string[]; nodes: string[] } {
    //visited
    visited.add(current);

    // Base case: if the current node is the destination, return a path of length 1
    if (current === destination) {
        return { maxLength: 1, path: [current], nodes: [graph.node(current)] };
    }

    let maxLength = 0;
    let maxPath: string[] = [];
    let nodes: string[] = [];

    // Explore neighbors
    const neighbors = graph.neighbors(current) as string[];
    for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
            const result = dfs(neighbor, destination, new Set(visited), graph);
            if (result.maxLength > maxLength) {
                maxLength = result.maxLength;
                maxPath = result.path;
                nodes = result.nodes;
            }
        }
    }

    // If the current node is part of the longest path, update the result
    if (maxLength > 0) {
        maxLength++;
        maxPath.unshift(current);
        nodes.unshift(graph.node(current));
    }

    return { maxLength, path: maxPath, nodes };
}

interface Result {
    maxLength: number;
    path: string[];
    nodes: string[];
}

export const findLongestPath = (
    source: string,
    destination: string,
    graph: graphlib.Graph
): Result => {
    const result = dfs(source, destination, new Set<string>(), graph);
    return result;
};

export const maxPathDistance = (
    maxPath: string[],
    graph: graphlib.Graph
): number => {
    interface label {
        key: string;
        distance: number;
    }

    if (maxPath.length === 0 || !maxPath) {
        return 0;
    }

    let distance = 0;
    let temp: label = { key: "", distance: 0 };

    for (let i = 0; i < maxPath.length; i++) {
        if (i < maxPath.length - 1) {
            let src = maxPath[i];
            let dest = maxPath[i + 1];

            temp = graph.edge(src, dest);
            distance += temp.distance;
        }
    }

    return distance;
};

// export const createGraph = (stations: Station[]): graphlib.Graph => {

//     const graph = new graphlib.Graph({ directed: false });
//     const connected: Set<string> = new Set();

//     stations.forEach((station) => {
//         graph.setNode(String(station.id), station.stationName);
//         station.stationConn?.forEach((connections) => {
//             const connectionKey = `${station.code} - ${connections}`;
//             const reversedKey = `${connections} - ${station.code}`;

//             if (!connected.has(connectionKey) && !connected.has(reversedKey)) {
//                 const connectedStation = stations.find(
//                     (station: Station) => station.code === connections
//                 );
//                 if (connectedStation) {
//                     const edgeLabel = `${station.stationName}-${connectedStation.stationName}`;

//                     graph.setEdge(String(station.code), String(connectedStation?.code), {
//                         key: edgeLabel,
//                         distance: haversine(
//                             Number(station.stationCoord[0]),
//                             Number(station.stationCoord[1]),
//                             Number(connectedStation.stationCoord[0]),
//                             Number(connectedStation.stationCoord[1])
//                         ),
//                     });
//                     connected.add(connectionKey);
//                     connected.add(reversedKey);
//                 }
//             }
//         });
//     });

//     return graph;
// };