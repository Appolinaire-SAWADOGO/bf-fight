"use client";

import React from "react";
import { Button } from "../../button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type finishModalType = {
  steps: 1 | 2 | 3 | 4 | 5;
  setSteps: React.Dispatch<React.SetStateAction<1 | 2 | 3 | 4 | 5>>;
};

const Finish = ({ steps, setSteps }: finishModalType) => {
  const WinAndLoseNumber = useQuery(api.queries.getWinAndLoseNumber);
  const lastMatchStatut = useQuery(api.queries.getLastMatchStatut);

  return (
    <div className="flex flex-col w-full h-full text-center text-white tracking-widest gap-5">
      <div className="text-9xl">{lastMatchStatut}</div>
      <div className="flex gap-5 text-center items-center justify-center text-2xl">
        <span>{WinAndLoseNumber?.winNumber} win</span>
        <span>|</span>
        <span>{WinAndLoseNumber?.loseNumber} lose</span>
      </div>
      <div className="mt-10">
        <Button
          onClick={() => {
            if (steps === 5) setSteps(1);
          }}
          className="bg-transparent px-7 border border-white hover:bg-white hover:bg-opacity-15"
        >
          Home
        </Button>
      </div>
    </div>
  );
};

export default Finish;
