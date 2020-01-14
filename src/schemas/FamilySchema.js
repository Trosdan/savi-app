export default class FamilySchema {
    static schema = {
        name: "Family",
        primaryKey: "id",
        properties: {
            id: { type: "int", indexed: true },
            members: "Member[]"
        }
    };
}
