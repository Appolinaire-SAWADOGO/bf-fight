"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import CanvasHome from "@/components/ui/main/canvas/canvas-home";
import HomeModal from "@/components/ui/main/modals/home-modal";
import { useStoreUserEffect } from "@/lib/useStoreUserEffect.ts";
import { useClerk, useUser } from "@clerk/nextjs";
import { TriangleAlert } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const Page = () => {
  const [steps, setSteps] = useState<1 | 2 | 3 | 4 | 5>(1);
  const { user } = useUser();
  const { session } = useClerk();

  function checkIfMobile() {
    return (
      window.innerWidth < 1024 ||
      /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    );
  }

  useStoreUserEffect();

  useEffect(() => {
    const revokeOldSessions = async () => {
      if (!user) return;

      // Récupérer toutes les sessions actives
      const activeSessions = await user.getSessions();

      for (const s of activeSessions) {
        if (s.id !== session?.id) {
          await s.revoke(); // Révoquer toutes les anciennes sessions
        }
      }
    };

    revokeOldSessions();
  }, [user, session]); // S'exécute dès qu'un utilisateur se connecte

  return (
    <>
      <div className="flex items-center justify-center font-black w-screen h-screen relative">
        <Image
          src={"/images/background.png"}
          alt=""
          fill
          className="object-cover"
        />

        {steps !== 4 && (
          <div className="absolute w-full h-full size-0 bg-black bg-opacity-55 z-10"></div>
        )}

        <div className="flex items-center justify-center w-full h-full absolute size-0 z-20">
          {/* if steps === 4  */}
          {steps === 4 && !checkIfMobile() && (
            <CanvasHome steps={steps} setSteps={setSteps} />
          )}

          {/* if steps !== 4  */}
          {steps !== 4 && !checkIfMobile() && (
            <HomeModal steps={steps} setSteps={setSteps} />
          )}

          {/* is mobile */}
          {checkIfMobile() && (
            <div className="flex items-center justify-center w-[500px] max-w-full  h-auto py-10 px-5 bg-white bg-opacity-10 backdrop-blur-md mx-6 rounded-xl border-2 border-white border-opacity-10">
              <TriangleAlert className="text-neutral-200 w-8 h-8" />
              <Alert className="h-full bg-transparent border-0 text-neutral-200 tracking-wider -ml-1">
                <AlertDescription className="text-base">
                  Your device is not compatible with this game.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
