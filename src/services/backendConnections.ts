    import {gfetch} from './grafetch.js';
    import {storeData} from    '../storage';
    import creds from '../../creds.json'
    const getMembersFromFamily = (familyID: String) =>{
        const getMembersQuery = `query refugeeInfoByFamily {
            refugees(where:
              
              {
          Family:{equalTo:"${familyID}"}
              }
                            ) {
              results {
                name
                age
                gender
                scholarity
                identificationDocument
                identificationDocumentType
              }
            }
          }
          `
    }


    const bindMemberToFamily = async (familyID: String, memberID: String) => {
        const getFamilyMembersQuery:String = `
            query {
                families(where: { id: { equalTo: "${familyID}"} }) {
                results {
                    members
                }
                }
            }
        `
        let familyQueryResponse = await gfetch("https://parseapi.back4app.com/graphql", creds.header, getFamilyMembersQuery)
        let familyObj = JSON.parse(familyQueryResponse)
        let familyMembers = familyObj.data.families.results[0].members.ids
        familyMembers.push(memberID)
        familyMembers = this.stringfy(familyMembers)
        const updateFamilyQuery = `
        mutation {
            updateFamily(id: "${familyID}", 
              fields: {
              members: {
                  ids:[  {ids:[${familyMembers}]}  ]
                } 
            }) {
              id
              members
            }
          }
          
          `
          let updatedFamilyInfo = await gfetch("https://parseapi.back4app.com/graphql", creds.header, updateFamilyQuery)
          console.log(updatedFamilyInfo) 
          storeData('refugeeFamily', updatedFamilyInfo.toString())
          updatedFamilyInfo = JSON.parse(updatedFamilyInfo)
          return  updatedFamilyInfo

    }
    const createFamily = async ( ) =>{
        const createFamilyQuery = `
        mutation{
            createFamily(
              fields :{
              members:{ids:[]}
            }){
              id
              
            }
          }
        `
        console.log("creating family...")
        let response = await gfetch("https://parseapi.back4app.com/graphql", creds.header, createFamilyQuery)
        let resObj = JSON.parse(response)
        console.log(resObj.data.createFamily.id)
        const familyid =  resObj.data.createFamily.id
        console.log("Family id: "+familyid)
        const  storeOutput = await storeData("familyID", familyid.toString())
        console.log(storeOutput)
        return familyid
    }


    const addMember = async (name="", age="", job="", gender="", docType="", familyID="", primaryContact="", scholarity="", email="", needs="", identificationDocument="") =>{
        const createRefugee = `
        mutation {
            createRefugee(
              fields: {
                name: "${name}"
                age: "${age}"
                job: "${job}"
                gender: "${gender}"
                identificationDocumentType: "${docType}" 
                Family: {
                    link: "${familyID}"
                            }
                primaryContact: ${primaryContact}
                scholarity: "${scholarity}" 
                email: "${email}"
                needs: "${needs}" 
                identificationDocument: "${identificationDocument}" 
              }
            ) {
              id
            }
          }
          `
          console.log("Adding memberID...")
          let response = await gfetch("https://parseapi.back4app.com/graphql", creds.header, createRefugee)
          let resObj = JSON.parse(response)
          console.log(resObj.data.createRefugee.id)
          return resObj.data.createRefugee.id
    }
    