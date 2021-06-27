import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import ServerSetup from "./serverSetup.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Adds variables from a file to the environment
 * @param {string} file Environment file pathname
 * @returns {void} void
 */
const addEnvironmentVariables = async (file) => {
    try {
        const data = fs.readFileSync(file, { encoding: "utf-8" });
        const keyValueArray = data.split("\n");
    
        for(let index in keyValueArray) {
            const [key, ...rest] = keyValueArray[index].split('=');
            const value = rest.join('=');
    
            process.env[key.trim()] = value.trim();
        }
    } catch(e) {
        console.log(e.message);
    }
}

/**
 * Bootstrap the server and returns the app
 * @returns {Object} app
 */
export default () => {

    // initialize app and routes objects;
    const app = {
        get: null,
        post: null,
        put: null,
        delete: null,
        listen: null,
    };

    const routes = {
        GET: {},
        POST: {},
        PUT: {},
        PATCH:{},
        DELETE: {},
    };

    addEnvironmentVariables(path.resolve(__dirname, '../../.env'));

    /* 
    * Set up http verb methods for routing
    * url.replace(/^\/+|\/+$/g, "") transforms "/api/v1/" => "api/v1"
    */
    ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].forEach(method => 
        app[method.toLowerCase()] = (url, ...handlers) =>
            routes[method][url.replace(/^\/+|\/+$/g, "")] = handlers
    );

    const server = http.createServer(ServerSetup.returnRequestHandler(routes));

    app.listen = ServerSetup.returnListenFunction(server);

    return app;
}
