import { Image, StyleSheet, View } from "react-native";
import Carousel from 'pinar';

const HomeCarousel = () => {
    const sheltersData = [
        { id: 1, name: 'Shelter 1', imageUrl: require('../assets/image.png') },
        { id: 2, name: 'Shelter 2', imageUrl: require('../assets/image.png') },
        { id: 3, name: 'Shelter 3', imageUrl: require('../assets/image.png') },
        { id: 4, name: 'Shelter 4', imageUrl: require('../assets/image.png') },
        { id: 5, name: 'Shelter 5', imageUrl: require('../assets/image.png') },
        { id: 6, name: 'Shelter 6', imageUrl: require('../assets/image.png') },
        { id: 7, name: 'Shelter 7', imageUrl: require('../assets/image.png') },
        { id: 8, name: 'Shelter 8', imageUrl: require('../assets/image.png') },
    ];

    return (
        <View style={styles.carouselContainer}>
            <Carousel style={styles.carousel} showsControls={false}
            dotStyle={styles.dotStyle}
            activeDotStyle={[styles.dotStyle, {backgroundColor: 'white'}]}
            >
                {sheltersData.map(img => (
                    <Image key={img.id} source={img.imageUrl} style={styles.image} />
                ))}
            </Carousel>
        </View>
    );
}
const styles = StyleSheet.create({
    dotStyle: {
        width: 30,
        height: 3,
        backgroundColor: 'silver',
        marginHorizontal: 3,
        borderRadius: 3
    },
    image : {
        height: '100%',
        width: '100%',
    },
    carousel : {
        height: '100%',
        width: '100%',
    },
    carouselContainer : {
        height: 200,
        width: '100%',
        borderRadius: 25,
        overflow: 'hidden',
        marginHorizontal: 20,
        marginTop : 10,
        marginLeft: 0
    }
})

export default HomeCarousel;