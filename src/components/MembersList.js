import { deleteRefugee } from "../services/backendIntegrations";

export function MemberList(props) {
    const members = props.members;
    const listOfMembers = members.map((member, i) => (
        <View style={{ flex: 1, flexDirection: "row" }} key={i}>
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    {member.name}
                </Text>
                <Text>{Math.trunc(member.age)} anos</Text>
            </View>
            <View style={{ flex: 2 }}>
                <Button onPress={() => deleteRefugee(member.id)}>-</Button>
            </View>
        </View>
    ));
    return (
        <ScrollView
            style={{ height: hp("66%"), marginLeft: wp("5%") }}
            horizontal={false}
        >
            {listOfMembers}
        </ScrollView>
    );
}
