const path = require('path');
const { getLogger } = require('../lib/logger');
const Logger = getLogger({ title: 'common controller' });

const RequestData = require('../common/RequestData');
const ResponseData = require('../common/ResponseData');
const { RESPONSE_CODE, RESPONSE_FIELD  } = require('../common/ResponseConst');

const fileUpload = require('../middleware/FileUpload');
const baseDir = path.resolve(process.env.UPLOAD_DIR) + '/';

const FileModel = require('../model/FileModel');

const upload = async (req, res) => {
    let requestData = new RequestData(req);
    let responseData = new ResponseData(requestData);

    try {
        await fileUpload(req, res, err => {
            if (err instanceof multer.MulterError) {
                responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
            }else{
                const result = FileModel.insertFile(requestData);

                if(result){
                    responseData.setDataValue(RESPONSE_FIELD.DATA, res.req.files);
                    responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
                } else {
                    responseData.setResponseCode(RESPONSE_CODE.DB_ERROR);
                }
            }
        });
        
    } catch (e) {
        Logger.debug(e);
        await requestData.error();
        responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);

    }
}

const download = async (req, res) => {
    let requestData = new RequestData(req);
    let responseData = new ResponseData(requestData);

    const fileName = req.params.fileId;
    const directoryPath = baseDir;

    const fileId = null;
    fileId = req.params.fileId;
    
    await requestData.start(true);
        
    const file = await FileModel.loadFile(requestData, fileId);
   try {
        await res.download(directoryPath + fileName + '.' + file.fileExt , fileName, (err) => {
            if (err) {
                responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
                res.send(responseData);
            } else {
                responseData.setResponseCode(RESPONSE_CODE.OK);
            }
        });
     } catch (e) {
        Logger.debug(e);
        await requestData.error();
        responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
        res.send(responseData);
     }
};

module.exports = {
    upload,
    download,
};