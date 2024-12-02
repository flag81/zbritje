import * as React from 'react';
import { Dimensions, Text, View, Image } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

function Banner() {
    const width = Dimensions.get('window').width;

    //console.log("width",width);
    //console.log("height",width / 2);

    const height = width / 2;

    const carouselData = [
		{
			id: "01",
			image: {uri:`https://res.cloudinary.com/dt7a4yl1x/image/upload/v1732992869/1556089636_xpqkz4.png`},
		},
		{
			id: "02",
			image: {uri:`https://res.cloudinary.com/dt7a4yl1x/image/upload/v1732992879/1720705367482_mmxplf.jpg`},
		},
		{
			id: "03",
			image: {uri:`https://res.cloudinary.com/dt7a4yl1x/image/upload/v1732892174/colgate.81b54c87_m9wowh_whxwub.png`},
            
		},
	];


    return (
        <View style={{height: 120}}>
            <Carousel
                loop
                width={width}             
                height={120}
                autoPlay={true}
                data={carouselData}
                mode="parallax"
                scrollAnimationDuration={3000}
                
                
                
                renderItem={({ index , item}) => (
                    <View
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            justifyContent: 'center',
                            backgroundColor: 'white',
                            
                        }}
                    >
                        <Image
					        source={item.image}
					        style={{ height: 100 }}
				        />
                       
                    </View>
                )}
            />
        </View>
    );
}


export default Banner;