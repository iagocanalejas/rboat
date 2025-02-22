import liveServer from "live-server";

const params = {
    port: 8080,
    host: "0.0.0.0",
    root: ".",
    open: false,
    file: "index.html",
    wait: 1000,
    //mount: [["/components", "./node_modules"]],
    logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
    middleware: [
        function (req, res, next) {
            next();
        },
    ],
};
liveServer.start(params);
