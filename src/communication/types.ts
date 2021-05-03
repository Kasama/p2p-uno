import { Game } from "../game/types";

export type Message =
  | {
      type: "peerlist";
      peers: string[];
    }
  | {
      type: "newpeer";
      peer: string;
    }
  | {
      type: "updategame";
      game: Game;
    };
