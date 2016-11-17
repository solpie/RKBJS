import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import SocketIO from "socket.io";
import rest from "rest";
import nedb from "nedb";
// import request1 from "request";

var nodeLibs = {
    express: express,
    ejs: ejs,
    bodyParser: bodyParser,
    SocketIO: SocketIO,
    rest: rest,
    nedb: nedb,
    // request1: request1,
};

export default nodeLibs;