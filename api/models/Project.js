/**
* Proyecto.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    connection: 'someMongodbServer',
    attributes: {
        name: {
            type: 'string',
            required: true
        },
        description:{
            type: 'string'
        },
        ownerId:{
            type: 'string',
            required: true
        },
        owner: {
            model: 'user'
        },
        tests: {
            collection: 'test',
            via: 'project'
        }

    }
};

