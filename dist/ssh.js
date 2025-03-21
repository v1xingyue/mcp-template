"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeWithSsh = void 0;
exports.getFlameSshConnection = getFlameSshConnection;
const ssh2_1 = require("ssh2");
const flameServer = process.env.FLAME_SERVER;
const flameUser = process.env.FLAME_USER;
const flamePassword = process.env.FLAME_PASSWORD;
const flameToken = process.env.FLAME_TOKEN;
function getFlameSshConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!flameServer || !flameUser || !flamePassword) {
            throw new Error("Missing required SSH connection parameters");
        }
        const ssh = new ssh2_1.Client();
        try {
            yield new Promise((resolve, reject) => {
                ssh
                    .on("ready", resolve)
                    .on("error", reject)
                    .connect({
                    host: flameServer,
                    port: parseInt(process.env.FLAME_SSH_PORT || "22"),
                    username: flameUser,
                    password: flamePassword,
                    hostVerifier: () => {
                        return true;
                    },
                });
            });
            return ssh;
        }
        catch (err) {
            ssh.end();
            throw new Error(`SSH connection failed: ${err.message}`);
        }
    });
}
const executeWithSsh = (items) => __awaiter(void 0, void 0, void 0, function* () {
    const results = [];
    const ssh = yield getFlameSshConnection();
    ssh.exec(items.command, {
        env: {
            TOKEN: flameToken,
        },
    }, (err, channel) => {
        channel.on("data", (data) => {
            console.log(data.toString());
            results.push(data.toString());
        });
        channel.on("end", () => {
            console.log("end");
            console.log(results);
        });
    });
    return results;
});
exports.executeWithSsh = executeWithSsh;
