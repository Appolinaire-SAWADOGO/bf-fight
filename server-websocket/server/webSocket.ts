import { api } from "../convex/_generated/api";
import { createServer } from "https";
import { Server as SocketIoServer } from "socket.io";
import { ConvexClient } from "convex/browser";

const convex = new ConvexClient(process.env.CONVEX_URL!);

const httpServer = createServer();

const io = new SocketIoServer(httpServer, {
  cors: {
    origin: "*",
  },
  transports: ["websocket"], // Désactive le polling côté serveur aussi
});

io.on("connection", (socket) => {
  // Écouter si un joueur est pret pour un match
  socket.on("joinMatch", async ({ matchId, userId }) => {
    // Appel à la mutation Convex côté serveur
    await convex.mutation(api.queries.postUserSocketId, {
      matchId,
      userId,
      socketId: socket.id,
    });
  });

  // ecouter l'evemenement du test de ping
  socket.on("pingTest", () => {
    // emettre la reponse
    socket.emit("pingTest");
  });

  // Écouter si un joueur veux envoyer des datas
  socket.on("sendData", async ({ data, userId }) => {
    // Récupère le socketId de l'adversaire
    const opponentSocketId = await convex.query(
      api.queries.getOpponentSocketID,
      {
        userId,
      }
    );

    // Envoyer les données au joueur adverse si son socketId est trouvé
    if (opponentSocketId) io.to(opponentSocketId).emit("opponentData", data);
  });
});

httpServer.listen(443, () => {
  console.log("Serveur WebSocket lancé sur le port 443");
});
