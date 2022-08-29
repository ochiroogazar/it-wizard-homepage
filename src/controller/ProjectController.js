const { getLogger } = require('../lib/logger');
const Logger = getLogger({ title: 'project controller' });

const path = require('path');

const RequestData = require('../common/RequestData');
const ResponseData = require('../common/ResponseData');
const { RESPONSE_CODE, RESPONSE_FIELD  } = require('../common/ResponseConst');

const fileUpload = require('../middleware/FileUpload');

const ProjectModel = require('../model/ProjectModel');
const FileModel = require('../model/FileModel');
const { INSUFFICIENT_SPACE_ON_RESOURCE } = require('http-status-codes');
const { nextTick } = require('process');

const getProjectsByTeam = async (req, res) => {
    let requestData = new RequestData(req);
    let responseData = new ResponseData(requestData);

    try {
        await requestData.start(true);
        
        const projectList = await ProjectModel.getProjectsByTeam(requestData, requestData.getBodyValue('teamSeq'));

        responseData.setDataValue(RESPONSE_FIELD.DATA, projectList);

        if(projectList){
            responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
        }else{
            responseData.setResponseCode(RESPONSE_CODE.DB_ERROR);
        }
    } catch (e) {
        Logger.debug(e);

        await requestData.error();
        responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);
    }
};

const insertProject = async (req, res) => {

    let requestData = new RequestData(req);
    let responseData = new ResponseData(requestData);

    try {
        const fieldList = [
            'projectName',
            'projectType',
        ];
        if (!requestData.hasAllMandatoryFields(fieldList)) {
            return responseData.setResponseCode(RESPONSE_CODE.REQUIRED_FIELD);
        }

        await requestData.start(true);

        const fileResult = {};

        if(req.file){      
            requestData.setBodyValue('file', req.file)  
            const fileResult = await FileModel.insertFile(requestData);
    
            if(!fileResult){
                responseData.setResponseCode(RESPONSE_CODE.FILE_ERROR);
            } 
            requestData.setBodyValue('fileSeq', fileResult[0].insertId);
        }

        const result = await ProjectModel.insertProject(requestData);

        if (result) {
            responseData.setResponseCode(RESPONSE_CODE.SUCCESS);
        } else {
            responseData.setResponseCode(RESPONSE_CODE.DB_ERROR);
        }


    } catch (e) {
        Logger.debug(e);
        await requestData.error();
        responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    } finally {
        await requestData.end(responseData.isSuccess());
        res.send(responseData);
    }

};
module.exports = {
    getProjectsByTeam,
    insertProject,
}