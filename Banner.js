import * as React from 'react';
import { Dimensions, Text, View, Image } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

function Banner() {
    const width = Dimensions.get('window').width;

    const carouselData = [
		{
			id: "01",
			image: {uri:`http://10.12.13.197:8800/images/slider_1.jpg`},
		},
		{
			id: "02",
			image: {uri:`http://10.12.13.197:8800/images/slider_2.jpg`},
		},
		{
			id: "03",
			image: {uri:`http://10.12.13.197:8800/images/slider_3.jpg`},
            
		},
	];

    return (
        <View>
            <Carousel
                loop
                width={width}
               
                height={width / 2}
                autoPlay={true}
                data={carouselData}
                mode="parallax"
                scrollAnimationDuration={1000}
                
                renderItem={({ index , item}) => (
                    <View
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            justifyContent: 'center',
                        }}
                    >
                    				<Image
					source={item.image}
					style={{ height: 200 }}
				/>
                       
                    </View>
                )}
            />
        </View>
    );
}

export default Banner;