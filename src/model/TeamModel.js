const { getLogger } = require('../lib/logger');
const Logger = getLogger({ title: 'team model' });

const Query = require('../database/Mybatis');

const { NAMESPACE, DB_RESULT, DB_FIELD_NAME } = require('../common/Constant');

const allTeams = async (requestData) => {
    try {
        const params = {
            teamSeq  : requestData.getBodyValue('teamSeq') != null ? requestData.getBodyValue('teamSeq') : '',
        };
        const connection = requestData.getConnection();
        const queryString = Query(NAMESPACE.TEAM, 'selectTeams', params);
        const [dataSet] = await connection.query(queryString);

        return dataSet;
    } catch (e) {
        Logger.error(e);
        throw e;
    }
}

const insertTeam = async (requestData) => {
    try {
        const teamName = requestData.getBodyValue("teamName");
        const params = {
            team_name  : teamName,
          };

        const connection = requestData.getConnection();
        const queryString = Query(NAMESPACE.TEAM, 'insert', params);
        const res = await connection.query(queryString);

        return res[DB_RESULT.ROW_FIRST][DB_RESULT.AFFECTED_ROWS] === DB_RESULT.ONE;;
    } catch (e) {
        Logger.error(e);
        throw e;
    }
}

const updateTeam = async (requestData, params) => {
    try {
        const seq = requestData.getSeq();
        params['seq']= seq;

        const connection = requestData.getConnection();
        const queryString = Query(NAMESPACE.TEAM, 'update', params);
        const res = await connection.query(queryString);

        return res[DB_RESULT.ROW_FIRST][DB_RESULT.AFFECTED_ROWS] === DB_RESULT.ONE;;
    } catch (e) {
        Logger.error(e);
        throw e;
    }
}

const deleteTeam = async (requestData) => {
    try {
        const seq = requestData.getSeq();
        params = {
            'seq' : seq,
        }
        
        const connection = requestData.getConnection();
        const queryString = Query(NAMESPACE.TEAM, 'delete', params);
        const res = await connection.query(queryString);

        return res[DB_RESULT.ROW_FIRST][DB_RESULT.AFFECTED_ROWS] === DB_RESULT.ONE;;
    } catch (e) {
        Logger.error(e);
        throw e;
    }
}

module.exports = {
    allTeams    ,
    insertTeam  ,
    updateTeam  ,
    deleteTeam  ,
  };