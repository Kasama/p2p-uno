import {
  Card,
  Game,
  GameConfig,
  Config,
  Player,
  Direction,
  Color,
} from "./types";
import _ from "lodash";

/* Randomize array in-place using Durstenfeld shuffle algorithm */
export function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export const COLORS: Color[] = ["blue", "red", "green", "yellow"];
export const NORMAL_FACES = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "+2",
  "reverse",
  "skip",
];
export const SPECIAL_FACES = ["+4", "change_color"];

export const newDeck: () => Card[] = () => {
  return [
    ...NORMAL_FACES.concat(NORMAL_FACES.filter((n) => n !== "0")) // two of each number card except for 0
      .map((n) => COLORS.map((c) => ({ color: c, face: n } as Card))) // each with one of the four colors
      .flat(),
    ...SPECIAL_FACES.concat(SPECIAL_FACES, SPECIAL_FACES, SPECIAL_FACES) // four of each wild cards
      .map((w) => ({ color: "wild", face: w } as Card)),
  ];
};

const defaultConfig: Config = {
  numDecks: 1,
  playerNames: ["player 1", "player 2", "player 3", "player 4"],
  startingHandSize: 7,
  maxDraws: 1,
  plusTwosStackWithFours: true,
  plusTwoSkip: false,
  plusFourSkip: true,
};

export const makeConfig: (config: GameConfig) => Config = (config) => ({
  ...defaultConfig,
  ...config,
});

const mod: (a: number, b: number) => number = (a, b) => ((a % b) + b) % b;

export const newGame: (gameConfig?: GameConfig) => Game = (gameConfig = {}) => {
  const config = makeConfig(gameConfig);
  const deck: Card[] = _.range(config.numDecks).map(newDeck).flat();
  shuffle(deck);
  const numPlayers = config.playerNames.length;
  return {
    deck: _.drop(deck, numPlayers * config.startingHandSize + 1),
    discard: [deck[numPlayers * config.startingHandSize]],
    players: config.playerNames.map(
      (p, i) =>
        ({
          name: p,
          cards: _.take(
            _.drop(deck, i * config.startingHandSize),
            config.startingHandSize
          ),
        } as Player)
    ),
    direction: "forward",
    currentPlayer: 0,
    currentDraws: 0,
    currentPot: [],
    winner: undefined,
    ...config,
  };
};

export const flipDirection: (direction: Direction) => Direction = (direction) =>
  direction === "forward" ? "backward" : "forward";

/**
 * @returns A tuple containing:
 *   - the new stack of cards without the taken ones
 *   - the taken cards
 */
export const takeCard: (
  stack: Card[],
  amount?: number,
  pos?: number
) => [Card[], Card[]] = (stack, amount = 1, pos = 0) => {
  const cards = _.slice(stack, pos, pos + amount);
  const newStack = [..._.take(stack, pos), ..._.drop(stack, pos + amount)];

  return [newStack, cards];
};

export const isValidPlay: (
  game: Game,
  topCard: Card,
  playedCard: Card
) => boolean = (game, topCard, playedCard) =>
  (game.currentPot.length > 0 && // there is a pot, so only reactions are valid
    (playedCard.face === "+2" || playedCard.face === "+4") && // reactions can only be +2 and +4
    (playedCard.face === topCard.face || // reactions of twos on twos and fours on fours is always allowed
      (game.plusTwosStackWithFours &&
        (playedCard.color === "wild" || // four on twos is allowed with rule
          (topCard.color === "wild" && // twos on fours is allowed with rule if their colors match
            playedCard.color === topCard.assignedColor))))) ||
  (game.currentPot.length <= 0 && // there is no pot, any card is valid
    (topCard.face === playedCard.face ||
      topCard.color === playedCard.color ||
      (topCard.color === "wild" && // topCard is a wildcard, use its assignedColor
        topCard.assignedColor === playedCard.color) ||
      playedCard.color === "wild")); // wild cards can always be played

export const canStackPot: (
  game: Game,
  topCard: Card,
  playedCard: Card
) => boolean = (game, topCard, playedCard) =>
  topCard.face === playedCard.face || // can always stack +4 on +4 or +2 on +2
  (game.plusTwosStackWithFours &&
    ((topCard.face === "+4" &&
      topCard.assignedColor === playedCard.color &&
      playedCard.face === "+2") || // on top of a +4, only a +2 of the same color is valid
      (topCard.face === "+2" && playedCard.face === "+4"))); // on top of a +2, a +4 is valid

export const playCardFromHand: (
  game: Game,
  playerIndex: number,
  cardIndex: number,
  wildSelectedColor?: Color
) => Game = (game, playerIndex, cardIndex, wildSelectedColor) => {
  if (game.currentPlayer !== playerIndex) return game;
  const player = game.players[playerIndex];
  const [hand, cards] = takeCard(player.cards, 1, cardIndex);
  const card = _.first(cards);
  const topCard = _.first(game.discard);
  if (card && topCard && isValidPlay(game, topCard, card)) {
    if (card.color === "wild") {
      card.assignedColor = wildSelectedColor ?? "green";
    }
    const newGame: Game = {
      ...game,
      discard: [card, ...game.discard],
      players: game.players.map((p, idx) =>
        idx === playerIndex ? { ...p, cards: hand } : p
      ),
      winner: hand.length === 0 ? game.players[playerIndex] : undefined,
      ...nextPlayer(game),
      ...cardEffect(game, card, hand),
    };
    return newGame;
  }
  return game;
};

export const drawCard: (game: Game, playerIndex: number) => Game = (
  game,
  playerIndex
) => {
  if (game.currentPlayer !== playerIndex) return game;
  const [deck, cards] = takeCard(game.deck);
  if (cards.length > 0) {
    const newGame = {
      ...game,
      deck,
      players: game.players.map((p, i) =>
        i === playerIndex ? { ...p, cards: [...p.cards, ...cards] } : p
      ),
      currentDraws: game.currentDraws + 1,
    };
    const topCard = _.first(game.discard);
    if (
      game.maxDraws >= 1 &&
      newGame.currentDraws >= game.maxDraws &&
      newGame.players[playerIndex].cards.every(
        (card) => topCard && !isValidPlay(game, topCard, card)
      )
    ) {
      return {
        ...newGame,
        ...nextPlayer(game),
      };
    } else {
      return newGame;
    }
  }
  return game;
};

export const cardEffect: (
  game: Game,
  card: Card,
  afterHand: Card[]
) => Partial<Game> = (game, card, afterHand) => {
  switch (card.face) {
    case "skip":
      return {
        ...nextPlayer(game, 2),
      };
    case "reverse":
      return {
        direction: flipDirection(game.direction),
        ...nextPlayer({ ...game, direction: flipDirection(game.direction) }),
      };
    case "+4":
    case "+2":
      const victimIndex = nextPlayer(game).currentPlayer;
      const victim = game.players[victimIndex];
      const victimCanStack = victim.cards.some((c) =>
        canStackPot(game, card, c)
      );
      if (victimCanStack) {
        return {
          currentPot: [...game.currentPot, card.face === "+2" ? 2 : 4],
        };
      } else {
        const [deck, cards] = takeCard(
          game.deck,
          _.sum(game.currentPot) + (card.face === "+2" ? 2 : 4),
          0
        );
        return {
          deck,
          players: game.players.map((p, i) => {
            if (i === victimIndex) {
              return { ...p, cards: [...p.cards, ...cards] };
            } else if (i === game.currentPlayer) {
              return { ...p, cards: afterHand };
            } else {
              return p;
            }
          }),
          currentPot: [],
          ...((card.face === "+2" && game.plusTwoSkip) ||
          (card.face === "+4" && game.plusFourSkip) ||
          (game.plusFourSkip && game.currentPot.find((val) => val === 4)) ||
          (game.plusTwoSkip && game.currentPot.find((val) => val === 2))
            ? nextPlayer(game, 2)
            : {}),
        };
      }
    default:
      return {};
  }
};

export const nextPlayer: (
  game: Game,
  offset?: number
) => Pick<Game, "currentPlayer" | "currentDraws"> = (game, offset = 1) => ({
  currentPlayer: mod(
    game.currentPlayer + (game.direction === "forward" ? 1 : -1) * offset,
    game.players.length
  ),
  currentDraws: 0,
});
