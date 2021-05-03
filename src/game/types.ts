export type Color = "blue" | "red" | "green" | "yellow";
export type Card =
  | {
      color: Color;
      face:
        | "0"
        | "1"
        | "2"
        | "3"
        | "4"
        | "5"
        | "6"
        | "7"
        | "8"
        | "9"
        | "+2"
        | "reverse"
        | "skip";
    }
  | {
      color: "wild";
      face: "+4" | "change_color";
      assignedColor?: Color;
    };

export type Player = {
  cards: Card[];
  name: string;
};

export type Direction = "forward" | "backward";

export type Config = {
  numDecks: number;
  playerNames: string[];
  startingHandSize: number;
  maxDraws: number;
  plusTwosStackWithFours: boolean;
  plusTwoSkip: boolean;
  plusFourSkip: boolean;
};

export type Game = {
  players: Player[];
  discard: Card[];
  deck: Card[];
  currentPlayer: number;
  direction: Direction;
  currentDraws: number;
  currentPot: number[];
  winner: undefined | Player;
} & Config;

export type GameConfig = Partial<Config>;

export type GameUpdateFunction = (game: Game) => Game;
