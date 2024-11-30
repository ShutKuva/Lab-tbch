import {
  createConfig,
  http,
  useAccount,
  useBlockNumber,
  useReadContract,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";
import contract from "../contracts/contracts.json";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { localhost } from "viem/chains";
import { watchContractEvent } from "@wagmi/core";
import { Log } from "viem";

const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function customWriteContract(functionName: string, args: any[]) {
  const { writeContract, error } = useWriteContract();
  console.log(error);
  const handler = useCallback(
    (otherArgs: any[]) => {
      writeContract({
        address,
        abi: contract,
        functionName,
        args: [...args, ...otherArgs],
      });
    },
    [writeContract, functionName, args]
  );

  return { handler };
}

function customWriteContractWithReturn(
  functionName: string,
  eventName: string,
  onLogs: (logs: Log[]) => void,
  args: any[]
) {
  useWatchContractEvent({
    abi: contract,
    address,
    onLogs,
    eventName,
    onError: (error) => {
      console.log("Error:");
      console.log(error);
    },
  });

  return { ...customWriteContract(functionName, args) };
}

function customReadContract(functionName: string, args: any[]) {
  const queryClient = useQueryClient();
  const { queryKey, data } = useReadContract({
    address,
    abi: contract,
    functionName,
    args,
  });
  const { data: blockNumber } = useBlockNumber({ watch: true });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, blockNumber]);

  return data;
}

export function useGetTokenForSong(onLogs: (logs: Log[]) => void) {
  const { address } = useAccount();
  return customWriteContractWithReturn(
    "getTokenForSong",
    "tokenCreated",
    onLogs,
    [address]
  );
}

export function useRegister() {
  const { address } = useAccount();
  return customWriteContract("register", [address]);
}

export function useCheckRegister() {
  const { address } = useAccount();
  return customReadContract("checkIsRegistered", [address]) as boolean;
}

export function useListenSong(songToken: string) {
  return customWriteContract("listenSong", [songToken]);
}

export function useGetListenings(songToken: string) {
  return customReadContract("getListenings", [songToken]) as number;
}

export function useGetRoyalty(songToken: string) {
  const royalty = customReadContract("getRoyalty", [songToken]);
  if (royalty) {
    return BigInt(royalty as bigint);
  }
  return 0;
}

export function useGetRoyaltyWithPartner(
  songToken: string,
  numberOfListenings: number
) {
  return (
    (customReadContract("getRoyaltyWithPartner", [
      songToken,
      numberOfListenings,
    ]) as bigint) / BigInt(100)
  );
}

export function useGetUsersSongs() {
  const { address } = useAccount();
  return customReadContract("getUsersSongs", [address]) as string[];
}

export function useGetSongs() {
  return customReadContract("getSongs", []) as string[];
}

export function useSyncListenings(songToken: string) {
  return customWriteContract("syncListenings", [songToken]);
}
