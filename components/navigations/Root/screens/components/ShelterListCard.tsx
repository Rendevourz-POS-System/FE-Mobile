import { FC } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export interface ShelterList {
    id?: string,
    blodId?: string,
    eventId?: string,
    speakerName: string,
    speakerProfession: string,
    speakerImageUrl?: string,
}

export interface IShelterList {
    data?: ShelterList,
}

export const ShelterListCard: FC<IShelterList> = ({
    data,
}) => {
    return (
        <View className='my-3 p-3 border rounded-md border-secondary-blue flex-row flex items-center justify-between'>
            <Image />
            <View className='items-center mr-10'>
                <Text className='mb-3'>name</Text>
                <TouchableOpacity>
                    <Text className='py-2 px-5 bg-primary-blue rounded-md'>View</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: 200,
        backgroundColor: "#fff",
        borderRadius: 30,
    },
    speakerImage: {
        width: 200,
        height: 125,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        resizeMode: 'cover',
    },
});