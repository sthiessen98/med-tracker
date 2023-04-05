import { View } from "react-native";
import MedListItem, { MedListItemProps } from "./MedListItem";

function MoveableMedListItem({med, position, logs, refetch, showToast, editMode, onEditPress}: MedListItemProps){

    console.log(position);
    return(
        <View style={{
            position: 'relative',
            left: 0,
            right: 0,
            top: position,
            zIndex: 1,
        }}>
            <MedListItem
            med={med}
            position={position}
            logs={logs}
            refetch={refetch}
            showToast={showToast}
            editMode={editMode}
            onEditPress={onEditPress}
            />
      </View>
    )
}

export default MoveableMedListItem;