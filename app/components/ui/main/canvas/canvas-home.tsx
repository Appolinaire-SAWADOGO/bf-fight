"use client";

import { Main } from "@/lib/canvas/class/main";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useRef } from "react";
import { Button } from "../../button";
import { Loader2, LogOut } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/hooks/use-toast";
import { playerEmplacementData } from "@/lib/utils";
import { websocket } from "@/lib/web-socket";
import { Socket } from "socket.io-client";

type canvasHomeType = {
  steps: 1 | 2 | 3 | 4 | 5;
  setSteps: React.Dispatch<React.SetStateAction<1 | 2 | 3 | 4 | 5>>;
};

const CanvasHome = ({ steps, setSteps }: canvasHomeType) => {
  const { isSignedIn } = useAuth();

  // reference
  const ref = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // toast
  const { toast } = useToast();

  // api founction
  const ifEnemyIsOut = useQuery(api.queries.ifEnemyIsOut);
  const characterNumber = useQuery(api.queries.getCurrentUserCharacterNumber);
  const currentUserNumberInMarch = useQuery(
    api.queries.getCurrentUserNumberInMarch
  );
  const currentUserName = useQuery(api.queries.getCurrentUserName);
  const matchIDAndUserMatchId = useQuery(api.queries.getMatchIDAndUserMatchId);
  const deleteMatch = useMutation(api.queries.deleteMatch);

  const charged = () => {
    return (
      characterNumber &&
      currentUserNumberInMarch &&
      currentUserName &&
      matchIDAndUserMatchId
    );
  };

  // if enemy is no signed
  useEffect(() => {
    if (!isSignedIn && steps === 4) setSteps(1);
  }, [isSignedIn, steps, setSteps]);

  // toast if enemy out
  useEffect(() => {
    if (ifEnemyIsOut) {
      toast({ description: "match over !" });
      setSteps(5);
    }
  }, [ifEnemyIsOut, toast, setSteps]);

  // theme sound
  useEffect(() => {
    const themeSound = new Audio();

    if (themeSound) {
      // demarer le son
      const playSound = async () => {
        if (!themeSound) return;

        themeSound.src = "/sound/theme-sound.ogg";
        themeSound.loop = true;
        await themeSound.play();
      };

      // jouer
      playSound();

      return () => {
        // si le composant est couper ; stopper le son
        themeSound.currentTime = 0;
        themeSound.pause();
        themeSound.src = "";
      };
    }
  }, []);

  // main
  useEffect(() => {
    if (!ref.current) return;
    if (!characterNumber) return;
    if (!currentUserNumberInMarch) return;
    if (!currentUserName) return;
    if (!matchIDAndUserMatchId) return;

    // take canvas context in 2d
    const ctx = ref.current!.getContext("2d");

    ref.current.width = innerWidth;
    ref.current.height = innerHeight;

    // player initial emplacement
    const playerEmplacement = playerEmplacementData(
      characterNumber,
      currentUserNumberInMarch,
      ctx as CanvasRenderingContext2D
    );

    // main
    let main: Main | null = new Main(
      ctx!,
      (characterNumber - 1) as 0 | 1,
      currentUserName,
      playerEmplacement.initialActionId,
      playerEmplacement.playerInitialX,
      playerEmplacement.playerInitialY,
      playerEmplacement.playerSize
    );

    // animation
    const animate = () => {
      ctx?.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // main gestion
      if (!main) return;

      main.update();

      // Connexion WebSocket
      websocket(main, matchIDAndUserMatchId, socketRef);

      // time out
      if (main.matchOver()) deleteMatch({ win: main.ifWin() });

      // someone is eliminated
      if (main.player1IsElemineted() && main.deadAnimationFinish)
        setTimeout(() => deleteMatch({ win: false }), 5000);

      // start animation in 60 fps
      requestAnimationFrame(animate);
    };

    animate();

    // Nettoyer la connexion WebSocket lorsqu'on démonte le composant
    return () => {
      main = null;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [
    characterNumber,
    currentUserName,
    currentUserNumberInMarch,
    matchIDAndUserMatchId,
    setSteps,
    deleteMatch,
  ]);

  return (
    <>
      {charged() ? (
        <div className="w-full h-full overflow-hidden relative">
          <canvas ref={ref} id="myCanvas" className="w-full h-full"></canvas>
          <Button
            onClick={async () => {
              await deleteMatch({ win: false });
              setSteps(5);
            }}
            className="flex gap-2 absolute bottom-8 left-1/2 text-xl bg-transparent hover:bg-white hover:bg-opacity-15 border border-white rounded-sm"
          >
            <LogOut />
            Exit
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <Loader2 className="w-10 h-10 animate-spin text-[#D77B05]" />
        </div>
      )}
    </>
  );
};

export default CanvasHome;
