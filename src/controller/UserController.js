const { getLogger } = require('../lib/logger');
const Logger = getLogger({ title: 'user controller' });
const JWT = require('../lib/jwt');
const Utils = require('../lib/utils');
const bcrypt = require('bcrypt');

const multer = require('multer');
const path = require('path');

const PayloadData = require('../common/PayloadData');

const RequestData = require('../common/RequestData');
const ResponseData = require('../common/ResponseData');

const {DB_FIELD_NAME} = require('../common/Constant');
const { RESPONSE_CODE, RESPONSE_FIELD } = require('../common/ResponseConst');

const UserModel = require('../model/UserModel');

const login = async (req, res) => {

    let   requestData     =  new RequestData(req);
    let   responseData    =  new ResponseData(requestData);
  
    try {
        const fieldList = [
            DB_FIELD_NAME.USER_ID,
            DB_FIELD_NAME.PASSWORD,
        ];
  
        if (!requestData.hasAllMandatoryFields(fieldList)) {
            return responseData.setResponseCode(RESPONSE_CODE.REQUIRED_FIELD);
        }
  
        await requestData.start(true);
  
        let userInfo = await UserModel.selectUser(requestData, requestData.getBodyValue(DB_FIELD_NAME.USER_ID));
  
        let password = requestData.getBodyValue(DB_FIELD_NAME.PASSWORD);

        if (userInfo == null) {
            const siteInfo = await UserModel.getSuperAdmin(requestData);
            userInfo = {};
            if(siteInfo.su_admin_id === requestData.getBodyValue(DB_FIELD_NAME.USER_ID)){
                userInfo[DB_FIELD_NAME.USER_ID] = siteInfo.su_admin_id;
                userInfo[DB_FIELD_NAME.USER_NAME] = siteInfo.su_admin_name;
                userInfo[DB_FIELD_NAME.PASSWORD] = siteInfo.su_admin_password;
                userInfo[DB_FIELD_NAME.SALT] = siteInfo.salt;
            } else {
                return responseData.setResponseCode(RESPONSE_CODE.WRONG_ACCOUNT);
            }
        }
  
        const dbPassword  = userInfo[DB_FIELD_NAME.PASSWORD];
        const salt        = userInfo[DB_FIELD_NAME.SALT];

        password = await bcrypt.hash(password, salt);

        if(password !== dbPassword) {
            return  responseData.setResponseCode(RESPONSE_CODE.WRONG_PASSWORD);
        }
  
        let payload = new PayloadData();
        payload.loadObject(userInfo);
  
        const payloadObject = payload.getObject();
        const token = JWT.getJWTToken(payloadObject);
        userInfo['token'] = token;
        responseData.setDataValue(RESPONSE_FIELD.DATA, userInfo);
    }
    catch (e) {
      Logger.error(e.stack);
      await requestData.error();
      responseData.setResponseCode(RESPONSE_CODE.CONTACT_ADMIN);
    }
    finally {
      await requestData.end(responseData.isSuccess());
      res.send(responseData);
    }
  };

  module.exports = {
    login,
  };