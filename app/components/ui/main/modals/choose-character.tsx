"use client";

import { characters } from "@/lib/utils";
import clsx from "clsx";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "../../button";
import Typewriter from "typewriter-effect";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useToast } from "@/hooks/use-toast";

type chooseCharacterType = {
  steps: 1 | 2 | 3 | 4 | 5;
  setSteps: React.Dispatch<React.SetStateAction<1 | 2 | 3 | 4 | 5>>;
};

export const ChooseCharacter = ({ setSteps }: chooseCharacterType) => {
  const [selectCharactere, setSelectCharactere] = useState<string>("magician");

  const isEnemyReady = useQuery(api.queries.isEnemyReady);
  const isPlayerReady = useQuery(api.queries.isPlayerReady);
  const ifEnemyIsOut = useQuery(api.queries.ifEnemyIsOut);
  const ready = useMutation(api.queries.ready);
  const cancelReady = useMutation(api.queries.cancelReady);
  const selectCharac = useMutation(api.queries.selectCharacter);

  const { toast } = useToast();

  const goPlay = async () => {
    if (!isPlayerReady) await ready();
    else cancelReady();
  };

  const select = async (character: string) => {
    setSelectCharactere(character);
    await selectCharac({ character });
  };

  useEffect(() => {
    if (ifEnemyIsOut) {
      toast({ description: "match stopped !" });
      setSteps(1);
    }
    if (isPlayerReady && isEnemyReady) setSteps(4);
  }, [isEnemyReady, isPlayerReady, ifEnemyIsOut, toast, setSteps]);

  return (
    <>
      <div className="text-white tracking-wider w-auto flex flex-col items-center justify-center gap-9">
        <span className="text-2xl w-full flex items-start justify-start text-start">
          choose character
        </span>
        <div className="flex gap-6">
          {characters.map((character, index) => (
            <div
              key={index}
              onClick={() => {
                if (!isPlayerReady) select(character.name);
              }}
              className={clsx(
                "flex items-center justify-center w-[200px] h-[150px] bg-[#D9D9D9] bg-opacity-25 rounded-lg",
                selectCharactere === character.name &&
                  "border-[3px] border-[#D77B05]"
              )}
            >
              <Image
                alt={character.name}
                src={character.imageSrc}
                width={character.width}
                height={character.height}
                className={clsx(character.name === "wizard" && "scale-125")}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div
            className={clsx(
              "h-3 w-3 rounded-full ",
              isEnemyReady ? "bg-[#56DF24]" : "bg-[#DF2424]"
            )}
          ></div>
          <span className="flex gap-2">
            {!isEnemyReady ? (
              <>
                waiting for the opponen
                <Typewriter
                  options={{
                    strings: ["... "],
                    autoStart: true,
                    loop: true,
                    cursor: "",
                  }}
                />
              </>
            ) : (
              <>enemy is ready !</>
            )}
          </span>
        </div>
      </div>
      <div className="w-full flex justify-between items-center mt-7 px-16">
        <Button className="bg-transparent px-10 border-white hover:bg-white hover:bg-opacity-15 opacity-0 cursor-default">
          <i className="fa-solid fa-arrow-left text-xl"></i>
        </Button>
        <Button
          onClick={() => goPlay()}
          className={clsx(
            "bg-transparent px-10 border border-white hover:bg-white hover:bg-opacity-15",
            isPlayerReady && "bg-[#D77B05] bg-opacity-35"
          )}
        >
          {isPlayerReady ? "not ready" : "ready"}
        </Button>
        <Button className="bg-transparent px-10 border border-white hover:bg-white hover:bg-opacity-15 opacity-0 cursor-default">
          ready
        </Button>
      </div>
    </>
  );
};
