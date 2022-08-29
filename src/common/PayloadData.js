const {DB_FIELD_NAME} = require('../common/Constant');

class PayloadData {
    constructor(){
        this.userID = null;
        this.userName = null;
    }

    loadObject(payload){
        if(payload.hasOwnProperty(DB_FIELD_NAME.USER_ID)){
            this.userID = payload[DB_FIELD_NAME.USER_ID];
        }

        if(payload.hasOwnProperty(DB_FIELD_NAME.USER_NAME)){
            this.userName = payload[DB_FIELD_NAME.USER_NAME];
        }
    }

    getObject(){
        const payload = {
            [DB_FIELD_NAME.USER_ID] : this.userID,
            [DB_FIELD_NAME.USER_NAME] : this.userName
        };
        return payload;
    }

    getUserID(){
        return this.userID;
    }
}

module.exports = PayloadData;