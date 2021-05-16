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
import { v4 as uuid } from "uuid";

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
  unoPenalty: 5,
  jumpIn: false,
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
  let game: Game = {
    id: uuid(),
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
    unclaimedUno: undefined,
    ...config,
  };

  while (SPECIAL_FACES.includes(_.first(game.discard)?.face ?? "")) {
    const [card, newDeck] = takeCard(game.deck);
    const d = [...newDeck, ...game.discard];
    shuffle(d);
    game = updateGame(game, {
      discard: card,
      deck: d,
    });
  }

  return game;
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
  playedCard: Card,
  playerIndex: number
) => boolean = (game, topCard, playedCard, playerIndex) =>
  (game.currentPlayer === playerIndex &&
    ((game.currentPot.length > 0 && // there is a pot, so only reactions are valid
      canStackPot(game, topCard, playedCard)) ||
      (game.currentPot.length <= 0 && // there is no pot, any card is valid
        (topCard.face === playedCard.face ||
          topCard.color === playedCard.color ||
          (topCard.color === "wild" && // topCard is a wildcard, use its assignedColor
            topCard.assignedColor === playedCard.color) ||
          playedCard.color === "wild")))) || // wild cards can always be played
  (game.jumpIn &&
    playedCard.face === topCard.face &&
    playedCard.color === topCard.color);

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
  const player = game.players[playerIndex];
  const [hand, cards] = takeCard(player.cards, 1, cardIndex);
  const card = _.first(cards);
  const topCard = _.first(game.discard);
  if (card && topCard && isValidPlay(game, topCard, card, playerIndex)) {
    console.log("I can play this!");
    if (card.color === "wild") {
      card.assignedColor = wildSelectedColor ?? "green";
    }
    return updateGame(game, {
      discard: [card, ...game.discard],
      players: game.players.map((p, idx) =>
        idx === playerIndex ? { ...p, cards: hand } : p
      ),
      winner: hand.length === 0 ? game.players[playerIndex] : undefined,
      unclaimedUno: hand.length === 1 ? playerIndex : undefined,
      ...nextPlayer(game, 1, playerIndex),
      ...cardEffect(game, card, hand),
    });
  }
  return game;
};

export const updateGame: (game: Game, update: Partial<Game>) => Game = (
  game,
  update
) => ({ ...game, ...update, id: uuid() });

export const claimUno: (game: Game, playerIndex: number) => Game = (
  game,
  claimingPlayerIndex
) => {
  if (game.unclaimedUno === undefined) return game;

  const [deck, cards] = takeCard(game.deck, game.unoPenalty);
  return game.unclaimedUno !== claimingPlayerIndex
    ? updateGame(game, {
        deck,
        players: game.players.map((p, i) =>
          i === game.unclaimedUno ? { ...p, cards: [...p.cards, ...cards] } : p
        ),
        unclaimedUno: undefined,
      })
    : updateGame(game, {
        unclaimedUno: undefined,
      });
};

export const drawCard: (game: Game, playerIndex: number) => Game = (
  game,
  playerIndex
) => {
  if (game.currentPlayer !== playerIndex) return game;
  const [deck, cards] = takeCard(game.deck);
  if (cards.length > 0) {
    const newGame = updateGame(game, {
      deck,
      players: game.players.map((p, i) =>
        i === playerIndex ? { ...p, cards: [...p.cards, ...cards] } : p
      ),
      currentDraws: game.currentDraws + 1,
    });
    const topCard = _.first(game.discard);
    if (
      game.maxDraws >= 1 &&
      newGame.currentDraws >= game.maxDraws &&
      newGame.players[playerIndex].cards.every(
        (card) => topCard && !isValidPlay(game, topCard, card, playerIndex)
      )
    ) {
      return updateGame(newGame, nextPlayer(game));
    } else {
      return newGame;
    }
  }
  return game;
};

export const acceptPunishment: (game: Game, playerIndex: number) => Game = (
  game,
  playerIndex
) => {
  const [deck, cards] = takeCard(game.deck, _.sum(game.currentPot), 0);
  return updateGame(game, {
    deck,
    players: game.players.map((p, i) => {
      if (i === playerIndex) {
        return { ...p, cards: [...p.cards, ...cards] };
      } else {
        return p;
      }
    }),
    currentPot: [],
    ...((game.plusFourSkip && game.currentPot.find((val) => val === 4)) ||
    (game.plusTwoSkip && game.currentPot.find((val) => val === 2))
      ? nextPlayer(game)
      : {}),
  });
};

export const cardEffect: (
  game: Game,
  card: Card,
  afterHand: Card[]
) => Partial<Game> = (game, card, _) => {
  switch (card.face) {
    case "skip":
      return {
        ...nextPlayer(game, 2),
      };
    case "reverse":
      const newDirection = flipDirection(game.direction);
      return {
        direction: newDirection,
        ...nextPlayer(
          updateGame(game, { direction: newDirection }),
          game.players.length === 2 ? 2 : 1
        ),
      };
    case "+4":
    case "+2":
      return {
        currentPot: [...game.currentPot, card.face === "+2" ? 2 : 4],
      };
    default:
      return {};
  }
};

export const nextPlayer: (
  game: Game,
  offset?: number,
  currentPlayer?: number
) => Pick<Game, "currentPlayer" | "currentDraws"> = (
  game,
  offset = 1,
  currentPlayer = game.currentPlayer
) => ({
  currentPlayer: mod(
    currentPlayer + (game.direction === "forward" ? 1 : -1) * offset,
    game.players.length
  ),
  currentDraws: 0,
});
