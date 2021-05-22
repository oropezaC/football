import express from 'express';
import {Request,Response,Router} from 'express';

import {RouterApp} from './router/index'
import { Config } from './config/conf';

const  morganMiddleware = require('./config/morgan')

const router = Router()

 class App{
    app : any ;
    res : Request;
    req : Response;
    routerIndex = new RouterApp(router);
    configuration = new Config().build()
    constructor(){
        this.app = express()
        this.config();
    }
    
    private config(){
        this.app.config = this.configuration
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:false}))
        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Credentials");
            res.header("Access-Control-Allow-Headers", "*");
            res.header("Access-Control-Allow-Methods", "DELETE, POST, GET, PUT, OPTIONS");
            next();
        });
        this.app.use(morganMiddleware)
        this.app.set('port', this.app.config.port);
        this.app.set('name_app',this.app.config.app.name)
        this.app.use('/api',this.routerIndex.root())

    }
}

export default new App().app;
