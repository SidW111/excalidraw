import { WebSocketServer } from "ws";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt, { JwtPayload } from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const decodedToken = jwt.verify(token, JWT_SECRET);
  if(typeof decodedToken == "string"){
    ws.close();
    return
  }
  if(!decodedToken || !decodedToken.userId){
    ws.close()
    return ;
  }
  ws.on("message", function message(data) {
    ws.send("pong");
  });
});

console.log({ msg: "connected wss" });
