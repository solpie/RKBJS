import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import SocketIO from "socket.io";
import rest from "rest";
var nodeLibs = {
    express: express,
    ejs: ejs,
    bodyParser: bodyParser,
    SocketIO: SocketIO,
    rest: rest,
};

export default nodeLibs;