import path from 'path'
const env = process.env.NODE_ENV || '';
const root_path = path.normalize(__dirname + '/..');
require('dotenv').config({path: root_path + '/.env'});

export class Config{
    configuration;
    build():void{
        this.configuration = {
            root: root_path,
            app: {
                name: process.env.APP_NAME
            },
            port: parseInt(process.env.PORT),
        }

        return this.configuration
    }
}