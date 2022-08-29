const { getLogger } = require('../lib/logger');
const Logger = getLogger({ title: 'team model' });

const Query = require('../database/Mybatis');

const { NAMESPACE, DB_RESULT, DB_FIELD_NAME } = require('../common/Constant');
const { EXPECTATION_FAILED } = require('http-status-codes');

const getProjectsByTeam = async (requestData, id = null) => {

    let teamId = null;

    if(id != null) {
        teamId = id;
    }

    const params = {
        teamSeq :  teamId,
      };

    try {
        const connection = requestData.getConnection();

        const queryString = Query(NAMESPACE.PROJECT, 'getProjectsByTeam', params);
        console.log(queryString);

        const [dataSet] = await connection.query(queryString);
        
        return dataSet;
    } catch (e) {
        Logger.error(e);
        throw e;
    }
}

const insertProject = async (requestData) => {

    const params = {
        teamSeq :  requestData.getBodyValue('teamSeq') != null ? requestData.getBodyValue('teamSeq') : '',
        fileSeq :  requestData.getBodyValue('fileSeq') != null ? requestData.getBodyValue('fileSeq') : '',
        fileName :  requestData.getBodyValue('fileName') != null ? requestData.getBodyValue('fileName') : '',
        projectName :  requestData.getBodyValue('projectName') != null ? requestData.getBodyValue('projectName') : '',
        projectType :  requestData.getBodyValue('projectType') != null ? requestData.getBodyValue('projectType') : '',
        relatedUrl :  requestData.getBodyValue('relatedUrl') != null ? requestData.getBodyValue('relatedUrl') : '',
      };

    try {
        const connection = requestData.getConnection();

        const queryString = Query(NAMESPACE.PROJECT, 'insert', params);
        console.log(queryString);

        const res = await connection.query(queryString);
        
        return res[DB_RESULT.ROW_FIRST][DB_RESULT.AFFECTED_ROWS] === DB_RESULT.ONE;;
    } catch (e) {
        Logger.error(e);
        throw e;
    }
}

module.exports = {
    getProjectsByTeam,
    insertProject,
}