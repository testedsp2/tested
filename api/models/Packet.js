/**
* Packet.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

 connection: 'someMongodbServer',
    schema: false,
    tableName: 'items',  
    attributes: {
    	type: {
    		type: 'string',
    		required: true
    	},
        name: {
            type: 'string',
            required: true
        },        
        description:{
            type: 'string'
        },        
        parentId:{
            type: 'string'
        },

        projectId:{
            type: 'string'
        },
        project: {
            model: 'project'
        }    
    }
};

