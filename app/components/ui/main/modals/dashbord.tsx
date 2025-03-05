"use client";

import React, { useEffect } from "react";
import { Separator } from "../../separator";
import { Avatar, AvatarFallback, AvatarImage } from "../../avatar";
import { Button } from "../../button";
import Link from "next/link";
import { SignInButton, useAuth } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import clsx from "clsx";

type dashbordType = {
  steps: 1 | 2 | 3 | 4 | 5;
  setSteps: React.Dispatch<React.SetStateAction<1 | 2 | 3 | 4 | 5>>;
};

const Dashbord = ({ steps, setSteps }: dashbordType) => {
  const { isSignedIn, isLoaded, signOut } = useAuth();

  const historicals = useQuery(api.queries.getHistorical);
  const ranks = useQuery(api.queries.getRanks);
  const currentUser = useQuery(api.queries.getCurentUser);
  const currentUserRank = useQuery(api.queries.getCurrentUserRank);
  const exitWaitingRoom = useMutation(api.queries.exitWaitingRoom);
  const deleteMatch = useMutation(api.queries.deleteMatch);

  useEffect(() => {
    if (isLoaded) {
      exitWaitingRoom();
      deleteMatch({
        win: false,
      });
    }
  }, [exitWaitingRoom, isLoaded, deleteMatch]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-16 px-10">
        <div className="flex flex-col gap-7 text-white tracking-wider">
          <h1 className="text-3xl">historical</h1>
          {isSignedIn && historicals && historicals?.length > 0 ? (
            <div className="flex flex-col gap-5">
              {historicals.map(
                ({ win, opponentName, opponentImgSrc }, index) => (
                  <div key={index} className="flex gap-10">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback
                        className={clsx(
                          " bg-[#56DF24] text-sm",
                          win ? "bg-[#56DF24]" : "bg-[#DF2424]"
                        )}
                      >
                        You
                      </AvatarFallback>
                    </Avatar>
                    <span>VS</span>
                    <div className="flex gap-3 items-centers">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={opponentImgSrc} />
                        <AvatarFallback>
                          {opponentName.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{opponentName}</span>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center font-thin gap-2">
              no data
              {!isLoaded && <Loader2 className="w-4 h-4 animate-spin" />}
            </div>
          )}
        </div>
        <div className="h-full flex items-center justify-center text-center">
          <Separator
            orientation="vertical"
            className="text-white w-[2px] h-40 opacity-25 rounded-full mt-16"
          />
        </div>
        <div className="text-white w-[250px] flex flex-col gap-7  tracking-wider">
          <h1 className="text-3xl">
            ranks : {currentUserRank}# / {currentUser?.winNumber}w /{" "}
            {currentUser?.loseNumber}l / {currentUser?.matchNumber}m
          </h1>

          {isSignedIn && ranks && ranks.length > 0 ? (
            <div className="flex flex-col gap-4">
              {ranks.map(({ firstName, lastName, winNumber }, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 px-4 bg-[#4C4E53] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {index === 0 && (
                      <i className="fa-solid fa-trophy text-3xl text-[#FFD43B]"></i>
                    )}
                    {index === 1 && (
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="text-xl bg-[#9C9C9C]">
                          2
                        </AvatarFallback>
                      </Avatar>
                    )}
                    {index === 2 && (
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="text-xl bg-[#FBABAB]">
                          3
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex flex-col">
                      <span>{firstName}</span>
                      <span className="text-sm">{lastName}</span>
                    </div>
                  </div>
                  <span className="text-lg">{winNumber} W</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center font-thin gap-2">
              no data
              {!isLoaded && <Loader2 className="w-4 h-4 animate-spin" />}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center mt-7">
        {isSignedIn ? (
          <Button
            className="bg-transparent border-white  border w-36 text-base py-4 hover:bg-white hover:bg-opacity-15"
            onClick={() => {
              if (steps === 1) setSteps(2);
            }}
          >
            Search
          </Button>
        ) : (
          <SignInButton mode="modal">
            <Button className="bg-transparent border-white  border  w-36 text-base py-4 hover:bg-white hover:bg-opacity-15">
              Search
            </Button>
          </SignInButton>
        )}
      </div>
      <div className="w-full flex justify-between items-center text-white tracking-wider">
        <div className="flex gap-2 items-center group cursor-pointer">
          <i className="fa-brands fa-github text-lg"></i>
          <Link href={""} className="group-hover:underline">
            made by appolinaire sdg
          </Link>
          <span>v 1.0</span>
        </div>
        {isSignedIn ? (
          <Button
            className="flex gap-2 items-center bg-transparent py-2 hover:bg-white hover:bg-opacity-15"
            onClick={() => signOut()}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            logout
          </Button>
        ) : (
          <SignInButton mode="modal">
            <Button className="flex gap-2 items-center bg-transparent py-2 hover:bg-white hover:bg-opacity-15">
              <i className="fa-solid fa-right-to-bracket"></i>
              login
            </Button>
          </SignInButton>
        )}
      </div>
    </div>
  );
};

export default Dashbord;
