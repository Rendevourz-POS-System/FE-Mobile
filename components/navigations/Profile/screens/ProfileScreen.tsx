import { FC } from "react"
import { ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export const ProfileScreen: FC<{}> = () => {
    return (
        <SafeAreaView className='flex-1 mx-2'>
            <ScrollView>
                <View className="flex-1 flex-col items-center mt-20 mb-14">
                    <Text className="font-inter-bold text-lg">Profile Screen</Text>
                </View>

                <View className="flex-1 flex-col items-center mx-9 my-7 py-12 bg-pink-200 justify-center rounded-lg">
                    <Text className="font-inter-bold text-lg">Total Donation</Text>
                    <Text className="font-inter-regular text-lg">Rp. *****************</Text>
                </View>

                <View className="flex-1 flex-col items-center mx-9 my-7 py-12 bg-pink-200 justify-center rounded-lg">
                    <Text className="font-inter-bold text-lg">Adoption</Text>
                    <Text className="font-inter-regular text-lg ">10 Waiting for approval</Text>
                </View>

                <View className="flex-1 flex-col items-center mx-9 my-7 py-12 bg-pink-200 justify-center rounded-lg">
                    <Text className="font-inter-bold text-lg ">Rescue</Text>
                    <Text className="font-inter-regular text-lg ">10 Waiting for approval</Text>
                </View>
                <View className="flex-row justify-around my-7">
                    <View className="items-center bg-pink-200 rounded-lg">
                        <Text className="font-inter-bold text-lg m-14">Add Adopt Pet</Text>
                    </View>
                    <View className="items-center bg-pink-200 rounded-lg">
                        <Text className="font-inter-regular text-lg m-14">Profile Shelter</Text>
                    </View>
                </View>
            </ScrollView>


        </SafeAreaView>
    )
}