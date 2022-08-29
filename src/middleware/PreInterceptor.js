const {HTTP_REQUEST} = require('../common/Constant');

const { RequestAuthPass } = require('../common/RequestAuthPass');

const {getPayload} = require('../lib/jwt');
const {DATA_FIELD_NAME} = require('../common/Constant');
const {StatusCodes} = require('http-status-codes');
const {RESPONSE_FIELD} = require('../common/ResponseConst');


const PreInterceptor = async (req, res, next) => {

    if(req.originalUrl.startsWith('/api-docs')) {
        return next();
    }

    if(req.originalUrl.startsWith('/v1') || req.originalUrl.startsWith('/v2') || req.originalUrl.startsWith('/a1')) {
        return next();
    }

    if(RequestAuthPass.some(api => req.method === api[HTTP_REQUEST.METHOD] && req.originalUrl === api[HTTP_REQUEST.URL])){
        return next();
    }


    const responseData = getPayload(req);

    if(responseData.getResponseCode() === StatusCodes.OK){
        const payload = responseData.getDataValue(DATA_FIELD_NAME);

        req[DATA_FIELD_NAME] = payload;
        return next();
    } else {
        const data = responseData.getData();

        if(data.hasOwnProperty(RESPONSE_FIELD.CODE)){
            res.status(data[RESPONSE_FIELD.CODE]);
            delete data[RESPONSE_FIELD.CODE];
        }

        res.send(data);
    }
};

module.exports = PreInterceptor;