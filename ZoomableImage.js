import React, { useRef , useEffect, useState} from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';


const ZoomableImage = () => {
  const imageZoomRef = useRef(null);


  const imageUri = 'https://res.cloudinary.com/dt7a4yl1x/image/upload/v1734118258/469698133_994930622673046_400506658560303128_n_vglisf.jpg'; // Replace with your image URL

  // Get image dimensions before rendering


  

  return (
    <View style={styles.container}>
    <Text>ReactNativeZoomableView</Text>
    <View style={{ borderWidth: 5, flexShrink: 1, height: 500, width: '95%', paddingBottom: 10 }}>
      <ReactNativeZoomableView
        maxZoom={30}
        // Give these to the zoomable view so it can apply the boundaries around the actual content.
        // Need to make sure the content is actually centered and the width and height are
        // dimensions when it's rendered naturally. Not the intrinsic size.
        // For example, an image with an intrinsic size of 400x200 will be rendered as 300x150 in this case.
        // Therefore, we'll feed the zoomable view the 300x150 size.
       

      >
        <Image
          style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
          source={{ uri: imageUri }}
        />
      </ReactNativeZoomableView>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    paddingBottom: 50,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});

export default ZoomableImage;
