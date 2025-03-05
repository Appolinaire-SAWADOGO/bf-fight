function dijkstra(graph, start, end) {
  let distances = {};
  let previous = {};
  let queue = new Set(Object.keys(graph));

  // Initialisation des distances
  for (let node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  distances[start] = 0;

  while (queue.size) {
    // Sélection du noeud avec la plus petite distance
    let current = Array.from(queue).reduce((a, b) =>
      distances[a] < distances[b] ? a : b
    );
    queue.delete(current);

    // Si on atteint la destination, on reconstruit le chemin
    if (current === end) {
      let path = [];
      while (current !== null) {
        path.push(current);
        current = previous[current];
      }
      return path.reverse();
    }

    for (let neighbor in graph[current]) {
      let alt = distances[current] + graph[current][neighbor];
      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = current;
      }
    }
  }
  return []; // Retourne un tableau vide si aucun chemin n'est trouvé
}

// Définition du graphe (les villes et les distances entre elles)
const graph = {
  Ouagadougou: { "Bobo-Dioulasso": 320, Koudougou: 100 },
  "Bobo-Dioulasso": { Ouagadougou: 320, Banfora: 85 },
  Koudougou: { Ouagadougou: 100, Dédougou: 180 },
  Banfora: { "Bobo-Dioulasso": 85, Gaoua: 200 },
  Dédougou: { Koudougou: 180, Gaoua: 150 },
  Gaoua: { Banfora: 200, Dédougou: 150 },
};

// Test du plus court chemin entre Ouagadougou et Bobo-Dioulasso
console.log(dijkstra(graph, "Ouagadougou", "Gaoua"));
