import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { Card } from "./Card";
import { COLORS, drawCard, newGame, playCardFromHand } from "./game";
import _ from "lodash";
import { Color, Game } from "./game/types";
import Peer, { DataConnection } from "peerjs";
import { Message } from "./communication/types";
import { recvMessage, sendMessage } from "./communication";

function App() {
  const [game, setLocalGame] = useState(newGame({}));
  const [colorPicker, setColorPicker] = useState<
    ((color: Color) => Game) | undefined
  >(undefined);
  const [ready, setReady] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [name, setName] = useState("");
  const [connections, setConnections] = useState<DataConnection[]>([]);
  const [peers, setPeers] = useState<string[]>([]);

  const setGame = useCallback(
    (game: Game) => {
      if (isHost) {
        setLocalGame(game);
      }
      sendMessage(connections, { type: "updategame", game });
    },
    [connections, isHost]
  );

  useEffect(() => {
    if (connections && isHost) {
      connections.forEach((connection) =>
        sendMessage(connection, { type: "peerlist", peers })
      );
    }
  }, [peers, connections, isHost]);

  useEffect(() => {
    console.log("Peer list got updated!", peers);
  }, [peers]);

  useEffect(() => {
    console.log("Connections list got updated!", connections);
  }, [connections]);

  return (
    <div className="App">
      <header className="App-header">
        {!ready ? (
          <>
            {isHost ? (
              <div>
                <button
                  onClick={() => {
                    const game = newGame({
                      playerNames: peers,
                    });
                    setGame(game);
                    setReady(true);
                  }}
                >
                  Start game
                </button>
              </div>
            ) : (
              <span>Wait for host to start the game</span>
            )}
            <div>
              <ul>
                {peers.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <input
                type="text"
                placeholder="Name"
                disabled={
                  connections.length > 0 || peers.length > 0 ? true : false
                }
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
            <hr />
            {isHost && connections.length === 0 && (
              <div>
                <span>
                  Waiting for connections. Share your session ID: {sessionId}
                </span>
              </div>
            )}
            {!isHost && connections.length === 0 && (
              <>
                <div>
                  <button
                    disabled={name === ""}
                    onClick={() => {
                      const peer = new Peer();
                      peer.on("open", (id) => {
                        console.log("Listening in session", id);
                        setIsHost(true);
                        setPeers([name]);
                        setSessionId(id);
                        peer.on("connection", (conn) => {
                          console.log("Received connection!", conn);
                          setConnections((cs) => [...cs, conn]);

                          conn.on("data", (data) => {
                            const msg: Message = recvMessage(data);
                            console.log("Got data", msg);
                            switch (msg.type) {
                              case "newpeer":
                                setPeers((p) => {
                                  console.log(
                                    `Got new peer ${msg.peer}. Current`,
                                    p
                                  );
                                  return [...p, msg.peer];
                                });
                                break;
                              case "peerlist":
                                setPeers(msg.peers);
                                break;
                              case "updategame":
                                setGame(msg.game);
                                setReady(true);
                                break;
                              default:
                                break;
                            }
                          });

                          conn.on("open", () => {
                            console.log("Opened new conn!");
                            if (!isHost)
                              sendMessage(conn, {
                                type: "newpeer",
                                peer: name,
                              });
                          });
                        });
                      });
                    }}
                  >
                    Host a session
                  </button>
                </div>
                <span>or</span>
                <div>
                  <input
                    type="text"
                    placeholder="Session id"
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value)}
                  />
                  <button
                    disabled={sessionId === "" || name === ""}
                    onClick={() => {
                      console.log("trying to connect to", sessionId);
                      const peer = new Peer();
                      peer.on("open", (id) => {
                        console.log("I have ID", id);
                        const conn = peer.connect(sessionId);
                        setConnections((cs) => [...cs, conn]);

                        conn.on("data", (data) => {
                          const msg: Message = recvMessage(data);
                          console.log("Got data", msg);
                          switch (msg.type) {
                            case "newpeer":
                              setPeers((p) => {
                                console.log(
                                  `Got new peer ${msg.peer}. Current`,
                                  p
                                );
                                return [...p, msg.peer];
                              });
                              break;
                            case "peerlist":
                              setPeers(msg.peers);
                              break;
                            case "updategame":
                              if (isHost) {
                                setGame(msg.game);
                              } else {
                                setLocalGame(msg.game);
                              }
                              setReady(true);
                              break;
                            default:
                              break;
                          }
                        });

                        conn.on("open", () => {
                          console.log("Opened new conn!");
                          if (!isHost)
                            sendMessage(conn, {
                              type: "newpeer",
                              peer: name,
                            });
                        });
                      });
                    }}
                  >
                    Join a session
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            {game.winner ? (
              <span>We have a winner! Congrats {game.winner.name}</span>
            ) : (
              <>
                {colorPicker && (
                  <div>
                    {COLORS.map((color) => (
                      <button
                        style={{ backgroundColor: color }}
                        key={color}
                        onClick={() => {
                          setGame(colorPicker(color));
                          setColorPicker(undefined);
                        }}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                )}
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {game.players.map((player, playerIndex) => (
                    <div
                      key={player.name}
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <span
                        style={{
                          color:
                            game.currentPlayer === playerIndex
                              ? "green"
                              : "white",
                        }}
                      >
                        {player.name}
                      </span>
                      <span>{player.cards.length}</span>
                      <ul>
                        {player.cards.map((c, i) => (
                          <div key={i} style={{ margin: "3px" }}>
                            <Card
                              hidden={player.name !== name}
                              key={i}
                              onClick={() => {
                                if (c.color === "wild") {
                                  setColorPicker(() => (color: Color) => {
                                    return playCardFromHand(
                                      game,
                                      playerIndex,
                                      i,
                                      color
                                    );
                                  });
                                } else {
                                  setGame(
                                    playCardFromHand(game, playerIndex, i)
                                  );
                                }
                              }}
                              card={c}
                            />
                          </div>
                        ))}
                      </ul>
                      {player.name === name && (
                        <button
                          onClick={() => {
                            if (player.name === name)
                              setGame(drawCard(game, playerIndex));
                          }}
                        >
                          Take card
                        </button>
                      )}
                    </div>
                  ))}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>Top card</span>
                    {<Card card={_.first(game.discard)} />}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>
                      POT: {JSON.stringify(game.currentPot)} ={" "}
                      {_.sum(game.currentPot)}
                    </span>
                    <span>Deck - {game.deck.length}</span>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </header>
    </div>
  );
}

export default App;
