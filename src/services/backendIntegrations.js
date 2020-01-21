import { fetchData, storeData } from "../storage";
import client from "./client";
 export  const deleteRefugee = async memberID => {
        const deleteRefugeeMutation = `
            mutation {
                deleteRefugee(id:${memberID}}){id}
            }

        `;
        const response = await client.gfetch(deleteRefugeeMutation);
        console.log(response);
    };
export const getMembersFromFamily = async () => {
    let familyResponse = await fetchData("refugeeFamily");
    console.log("family inside asyncstorage: " + familyResponse);
    const familyObject = JSON.parse(familyResponse);

    familyID = familyObject[0].id;

    getMembersDetails = `query refugeeInfoByFamily {
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
                  }
                }
              }
              `;

    let familyQueryResponse = await client.gfetch(getMembersDetails);
    let familyObj = JSON.parse(familyQueryResponse);
    let membersArray = familyObj.data.refugees.results;
    console.log(`Members array: ${membersArray}`);
    storeData("membersDetails", membersArray);
    return membersArray;
};
