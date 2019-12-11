export default class RefugeeSchema {
    static schema = {
        name:'Refugee',
        primaryKey:'id',
        properties:{
            objectId: 'string',
            name: 'string',
            age: 'string',
            primaryContact:'boolean',
            gender: 'string',
            job: 'string',
            scholarity: 'string',
            email: 'string',
            needs: 'string',
            identificationDocument: 'string',
            identificationDocumentType: 'string',
            createdAt: 'string',
            updatedAt: 'string',
            Family: 'string'
    }
}}
