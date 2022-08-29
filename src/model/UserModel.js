const { getLogger } = require('../lib/logger');
const Logger = getLogger({ title: 'user model' });

const Query = require('../database/Mybatis');
const path = require('path');

const { NAMESPACE, DB_RESULT, DB_FIELD_NAME } = require('../common/Constant');

const getSuperAdmin = async (requestData, ) => {
    try {  
      const params = {
        siteSeq : 1
      };
  
      const connection = requestData.getConnection();
  
      const queryString = Query(NAMESPACE.SITE,'selectSiteInfo', params);
  
      const [dataSet] = await connection.query(queryString);
  
      return dataSet[DB_RESULT.ROW_FIRST];
    }
    catch (e) {
      Logger.error(e.stack);
      throw e;
    }
};

const selectUser = async (requestData, ID = null) => {
    try {
  
      let userID    = null ;
      if(ID !== null){
        userID = ID;
      }
      else{
        userID = requestData.getUserID();
      }
  
      const params = {
        [DB_FIELD_NAME.USER_ID] :  userID ,
      };
  
      const connection = requestData.getConnection();
  
      const queryString = Query(NAMESPACE.USER,'selectUser', params);
  
      const [dataSet] = await connection.query(queryString);
  
      return dataSet[DB_RESULT.ROW_FIRST];
    }
    catch (e) {
      Logger.error(e.stack);
      throw e;
    }
};

const insertUser = async (requestData) => {

    try {
        const userID    = requestData.getBodyValue(DB_FIELD_NAME.USER_ID);
        const password  = requestData.getBodyValue(DB_FIELD_NAME.PASSWORD);
        const userName  = requestData.getBodyValue(DB_FIELD_NAME.USER_NAME);
        const salt      = requestData.getBodyValue(DB_FIELD_NAME.SALT);

        const params = {
        [DB_FIELD_NAME.USER_ID]   : userID,
        [DB_FIELD_NAME.PASSWORD]  : password,
        [DB_FIELD_NAME.USER_NAME] : userName,
        [DB_FIELD_NAME.SALT]      : salt,
        };

        const connection = requestData.getConnection();

        const statement = Query(NAMESPACE.USER,'insertUser', params);
        const res = await connection.query(statement);

        return res[DB_RESULT.ROW_FIRST][DB_RESULT.AFFECTED_ROWS] === DB_RESULT.ONE;
    }
    catch (e) {
        Logger.error(e.stack);
        throw e;
    }
};

const updateUser = async (requestData, params) => {

    try {
  
      const userID = requestData.getUserID();
      params[DB_FIELD_NAME.USER_ID]= userID;
  
      const connection = requestData.getConnection();
  
      const statement = Query(NAMESPACE.USER,'updateUser', params);
      const res = await connection.query(statement);
  
      return res[DB_RESULT.ROW_FIRST][DB_RESULT.AFFECTED_ROWS] === DB_RESULT.ONE;
    }
    catch (e) {
      Logger.error(e.stack);
      throw e;
    }
};

const deleteUser = async (requestData) => {

    try {
      const userID    = requestData.getUserID();
  
      const connection = requestData.getConnection();
  
      const params = {
        [DB_FIELD_NAME.USER_ID]   : userID,
      };
  
      const statement = Query(NAMESPACE.USER,'deleteUser', params);
      const res = await connection.query(statement);
  
      return res[DB_RESULT.ROW_FIRST][DB_RESULT.AFFECTED_ROWS] === DB_RESULT.ONE;
    }
    catch (e) {
      Logger.error(e.stack);
      throw e;
    }
  };
  
  module.exports = {
    selectUser,
    insertUser,
    updateUser,
    deleteUser,
    getSuperAdmin,
  };