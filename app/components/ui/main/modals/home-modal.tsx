"use client";

import React from "react";
import Dashbord from "./dashbord";
import Image from "next/image";
import SearchEnemy from "./search-enemy";
import { ChooseCharacter } from "./choose-character";
import Finish from "./finish";

type homeModalType = {
  steps: 1 | 2 | 3 | 4 | 5;
  setSteps: React.Dispatch<React.SetStateAction<1 | 2 | 3 | 4 | 5>>;
};

const HomeModal = ({ steps, setSteps }: homeModalType) => {
  return (
    <>
      {steps != 4 && (
        <div className="flex flex-col gap-6 items-center justify-center w-full max-w-[900px]  h-auto py-10 bg-white bg-opacity-10 backdrop-blur-md mx-6 rounded-xl border-2 border-white border-opacity-10">
          <Image
            src={"/images/logo.png"}
            alt="logo bf-fight"
            width={250}
            height={250}
          />
          {steps === 1 && <Dashbord steps={steps} setSteps={setSteps} />}
          {steps === 2 && <SearchEnemy steps={steps} setSteps={setSteps} />}
          {steps === 3 && <ChooseCharacter steps={steps} setSteps={setSteps} />}
          {steps === 5 && <Finish steps={steps} setSteps={setSteps} />}
        </div>
      )}
    </>
  );
};

export default HomeModal;
