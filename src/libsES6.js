import express from "express";
import mustacheExpress from "mustache-express";
import bodyParser from "body-parser";
import SocketIO from "socket.io";
// import unirest from "unirest"
var nodeLibs = {
    express:express,
    mustacheExpress:mustacheExpress,
    bodyParser:bodyParser,
    SocketIO:SocketIO,
    // unirest:unirest,
};

export default nodeLibs;