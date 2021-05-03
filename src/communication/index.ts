import { Message } from "./types";
import Peer from "peerjs";

export const sendMessage: (
  conn: Peer.DataConnection | Peer.DataConnection[] | undefined,
  message: Message
) => void = (conn, message) => {
  console.log("was tasked to send msg:", message, "to conn:", conn);
  if (Array.isArray(conn)) {
    conn.forEach((c) => {
      console.log(`Sending message to ${c.peer}`, message);
      c.send(JSON.stringify(message));
    });
  } else {
    console.log(`Sending message to ${conn?.peer}`, message);
    return conn?.send(JSON.stringify(message));
  }
};

export const recvMessage: (message: any) => Message = (message) =>
  JSON.parse(message) as Message;
