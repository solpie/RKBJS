import express from "express";
import mustacheExpress from "mustache-express";
import bodyParser from "body-parser";
import SocketIO from "socket.io";
import rest from "rest";
var nodeLibs = {
    express: express,
    mustacheExpress: mustacheExpress,
    bodyParser: bodyParser,
    SocketIO: SocketIO,
    rest: rest,
};

export default nodeLibs;