import { io, Socket } from "socket.io-client";
import { playerDataType } from "./types";
import { Main } from "./canvas/class/main";

export const websocket = (
  main: Main,
  matchIDAndUserMatchId: {
    userId: string;
    matchId: string;
  },
  socketRef: React.RefObject<Socket | null>
) => {
  const playerData = main.sendPayer1Data();

  if (!socketRef.current) {
    // nouvelle connexion
    const newSocket = io("http://localhost:3002", {
      transports: ["websocket"], // Force WebSocket
      upgrade: false, // (Optionnel) Désactive la mise à niveau pour éviter le polling
    });

    // Stocke le socket dans la référence
    socketRef.current = newSocket;

    socketRef.current.emit("joinMatch", {
      matchId: matchIDAndUserMatchId.matchId,
      userId: matchIDAndUserMatchId.userId,
    });
  }

  // test de ping
  // date au moment de l'envoi de l'evenement
  const date = new Date().getTime();

  // emettre l'evenement
  socketRef.current.emit("pingTest");

  // reception de l'evenement
  socketRef.current.on("pingTest", () => {
    // mesurer le ping
    const ping = new Date().getTime() - date;

    // mise a jour du ping
    main.updatePing(ping);
  });

  // Si le socket existe déjà, envoie les données
  socketRef.current.emit("sendData", {
    data: playerData,
    userId: matchIDAndUserMatchId.userId,
  });

  // ecouter les donnees de l'enemie
  socketRef.current.on("opponentData", (data: playerDataType) => {
    if (!data) return;

    main.player2DataUpdate(data);
  });
};
