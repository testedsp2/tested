/**
* Test.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    connection: 'someMongodbServer',
    tableName: 'items',
    schema: false,    
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
        resultado:{
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

