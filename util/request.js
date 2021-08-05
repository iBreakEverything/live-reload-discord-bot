import { request } from 'https';

/**
 * Sends a web request and returns a response.
 * @param {object} options headers
 * @param {boolean} keepData keep response body
 * @returns web response
 */
export function webRequest(options, keepData = true) {
    return new Promise(function (resolve, reject) {
        let req = request(options, function (res) {
            let body = '';
            if (keepData) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    body = body + chunk;
                });
                res.on('end', function () {
                    resolve(body);
                });
                res.on("error", function (err) {
                    reject(err);
                });
            }
            else {
                resolve(res.headers);
            }
        });
        req.on('error', function (err) {
            reject(err);
        });
        req.end();
    });
}
