"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../avatar";
import { Button } from "../../button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

type searchEnemyType = {
  steps: 1 | 2 | 3 | 4 | 5;
  setSteps: React.Dispatch<React.SetStateAction<1 | 2 | 3 | 4 | 5>>;
};

const SearchEnemy = ({ steps, setSteps }: searchEnemyType) => {
  const createMatch = useMutation(api.queries.createMatch);
  const enemyData = useQuery(api.queries.enemyData);

  const [timer, setTimer] = useState(0);

  useEffect(() => {
    createMatch();
  }, []);

  useEffect(() => {
    if (!enemyData) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev >= 3) {
          return 3;
        }
        return prev + 1;
      });

      if (timer >= 3) setSteps(3);
    }, 1000);

    return () => clearInterval(interval);
  }, [setTimer, enemyData, timer, setSteps]);

  return (
    <div className="flex w-full items-center justify-center text-center">
      <div className="flex flex-col w-full items-center justify-center text-white tracking-wider">
        {enemyData ? (
          <div className="flex gap-2">
            <div className="flex flex-col items-center  gap-7">
              <Avatar className="w-36 h-36">
                <AvatarImage
                  className="object-cover"
                  src={enemyData?.imageUrl}
                />
                <AvatarFallback>
                  {enemyData?.firstName?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-1">
                <span className="text-4xl text-center">
                  {enemyData?.lastName}
                </span>
                <span className="text-3xl text-center">
                  {enemyData?.firstName}
                </span>
              </div>
            </div>
            <div className="w-3 h-3 rounded-full bg-[#56DF24]"></div>
          </div>
        ) : (
          <div className="text-white tracking-widest text-lg flex justify-center items-center gap-3">
            not enemy <Loader2 className="w-[18px] h-[18px] animate-spin" />
          </div>
        )}

        <div className="w-full flex justify-between items-center mt-14 px-16">
          <Button
            className={clsx(
              "bg-transparent px-10 border-white hover:bg-white hover:bg-opacity-15",
              enemyData && "opacity-0 cursor-default "
            )}
            onClick={() => {
              if (steps === 2 && !enemyData) setSteps(1);
            }}
          >
            <i className="fa-solid fa-arrow-left text-xl"></i>
          </Button>
          <Button
            onClick={() => setSteps(3)}
            className={clsx(
              "bg-transparent px-10 border border-white hover:bg-white hover:bg-opacity-15",
              !enemyData && "opacity-0 cursor-default"
            )}
          >
            {timer}
          </Button>
          <Button className="bg-transparent px-10 border border-white hover:bg-white hover:bg-opacity-15 opacity-0 cursor-default">
            play
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchEnemy;
