import { fetchData, storeData, seeAllValues } from "../storage";
import client from "./client";

export const deleteRefugee = async memberID => {
    const deleteRefugeeMutation = `
            mutation {
                deleteRefugee(id:"${memberID}"){id}
            }

        `;
    const response = await client.gfetch(deleteRefugeeMutation);

    console.log(response);
};

export const getFamilyID = async email => {
    const getFamilyIDQuery = `
        query{
        refugees(limit:1, where:{email:{equalTo:${email}}}){
            results{                    
		Family{
      id
    }
                
                }
            }
        }
        
    `;
    const memberIDResponse = await client.gfetch(getFamilyIDQuery);
    let memberIDJSON = JSON.parse(memberIDResponse);
    console.log(memberIDJSON);

    return memberIDJSON.data.refugees.results[0].Family.id;
};
export const deleteFamily = async () => {
    let refugeeFamily = await fetchData("refugeeFamily");
    const refugeeFamilyObject = JSON.parse(refugeeFamily);
    const familyID = refugeeFamilyObject.id;
    const deleteFamilyMutation = `
    mutation {
        deleteFamily(id:"${familyID}"){
            id
        }
    }
    `;
    const familyDeletionResponse = await client.gfetch(deleteFamilyMutation);
    return familyDeletionResponse;
};
export const getMembersFromFamily = async () => {
    seeAllValues();

    const email = await fetchData("RefugeeEmail");
    const familyID = await getFamilyID(email);
    // let familyResponse = await fetchData("refugeeFamily");
    // console.log("family inside asyncqstorage: " + familyResponse);
    // const familyObject = JSON.parse(familyResponse);

    // familyID = familyObject[0].id;

    let getMembersDetails = `query refugeeInfoByFamily {
                refugees(where:
                  
                  {
              Family:{equalTo:"${familyID}"}
                  }
                                ) {
                  results {
                    name
                    email
                    age
                    scholarity
                    needs
                    identificationDocument
                    identificationDocumentType
                    primaryContact
                    id
                  }
                }
              }
              `;

    let familyQueryResponse = await client.gfetch(getMembersDetails);
    let familyObj = JSON.parse(familyQueryResponse);

    console.log(familyObj);
    let membersArray = familyObj.data.refugees.results;
    console.log(`Members array: ${membersArray}`);
    storeData("membersDetails", membersArray);

    return membersArray;
};
