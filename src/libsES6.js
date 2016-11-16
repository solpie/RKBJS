import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import SocketIO from "socket.io";
import rest from "rest";
import nedb from "nedb";
import request from "request";

let nodeLibs = {
    express: express,
    ejs: ejs,
    bodyParser: bodyParser,
    SocketIO: SocketIO,
    rest: rest,
    nedb: nedb,
    request: request,
};

export default nodeLibs;