import { Modal, View, Text, Pressable, StyleSheet, Image, ScrollView, Platform, Linking, Button, TouchableOpacity } from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';

// in this file replace word brand with brand and Brand with Brand




export default function BrandModal({ isVisible, children, onClose, brandDataPassed }) {

    const openPlayStore = () => {
        const appId = 'com.zs.vivafresh'; // Replace with your app's package name
        const url = `https://play.google.com/store/apps/details?id=${appId}`;
        Linking.openURL(url).catch(err => console.error("Failed to open brand:", err));
      };


      const openPhone = (phoneNumber) => {
        const url = `tel:${phoneNumber}`; // Replace with your app's package name
        //const url = `https://play.google.com/brand/apps/details?id=${appId}`;
        Linking.openURL(url).catch(err => console.error("Failed to open phone:", err));
      };

      const openWeb = (weburl) => {
        const url = weburl; // Replace with your app's package name
        //const url = `https://play.google.com/brand/apps/details?id=${appId}`;
        Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
      };


//const [brandDataPassed, setbrandDataPassed] = useState([]);


//getbrandDataPassed(1, 1);

  const ratingCompleted = (rating) => {
    console.log('Rating is: ' + rating);
  };

  // refer to file Brands.js for context, write a function that call the api to send the rating value to the server 
    // together with the brandId and the userId 
    // and update the database with the new rating value for the brandId and userId


   // the code should use async await and be something like this:
    const sendRating = async (rating) => {
        const response = await fetch(url + '/api/rating', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                brandId: brandId,
                rating: rating,
            }),
        })

        const data = await response.json();
        console.log(data);
    }


    // in vs code how to unccomment a block of code





  





//console.log("brandDataPassed",brandDataPassed);

if(brandDataPassed === undefined) {

    brandDataPassed = [];
}


//const url = 'http://10.12.13.197:8800';



let brandName = '' ;
let brandLogoUrl = '' ;
let brandCountry = '' ;



//brandDataPassed sample data : {"categoryId": "1", "discountPercentage": null, "discountPrice": "10", "oldPrice": "12", "brandId": 4, "brandName": "Nutella", "brandPic": "nutella.png", "brandSize": null, "saleEndDate": "2024-07-29T22:00:00.000Z", "saleId": 1, "saleStartDate": "2024-07-09T22:00:00.000Z", "brandId": "3", "brandLogo": "meridian.png", "subCategoryId": "10"}s

  brandDataPassed?.length > 0 ?  brandName = brandDataPassed[0]?.brandName : brandName ;


  if(brandDataPassed?.length > 0) {

        brandId = brandDataPassed[0]?.brandId;
        brandName = brandDataPassed[0]?.brandName;
        brandLogoUrl = brandDataPassed[0]?.brandLogoUrl;
  }



  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      

      <View style={styles2.modalContent}>
        <View style={styles2.titleContainer}>
          <Text style={styles2.title}>Detajet</Text>
          <Pressable onPress={onClose}>
          <Text style={styles2.title}>Mbyll X</Text>
          </Pressable>
        </View>
        
        <View style={{padding: 5,  flexDirection: 'row',  justifyContent: 'space-between', alignItems: 'center', marginBottom:10}}> 

          <ScrollView style={{flex:1}} contentContainerStyle={{ paddingBottom: 30 }}>

        <View style={{justifyContent: 'space-between', alignItems: 'center'}}>
            <Text>Sa jeni te kenaqur me kete brend</Text>

        </View>

          <Rating
            showRating
            type="star"
            fractions={1}
            startingValue={3.6}
            imageSize={20}
            onFinishRating={ratingCompleted}
            style={{ paddingVertical: 10 }} 
          />

          <View style={{flexDirection: 'col', justifyContent: 'space-between', alignItems: 'center'}}>
        

            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                {brandDataPassed?.length > 0 && brandLogoUrl? <Image source={{uri: brandLogoUrl}} style={[styles2.icon,  { paddingHorizontal:10}]} /> : null}
                <Image id="favoriteImage"
                    source={
                        brandDataPassed[0]?.isFavorite ? require('./star.png') : require('./white-star.png')
                    } style={styles2.star}
                />
            </View>

            {brandDataPassed?.length > 0 ? <Text>{brandName}</Text>  : null}
        

            { brandDataPassed[0]?.onSale ? <View style={{marginLeft: -28, zIndex: 2}}>
              <Image id="saleImage" source={require('./discount-red.png')} style={styles2.icon2} /></View> 
            : null}
            
                   

            
          </View>

          <View style={{ flex: 1, flexDirection :'row' ,justifyContent: 'center', alignItems: 'center' }}>


                <TouchableOpacity onPress={()=>openPhone('123456')} style={styles2.category}>
                            
                            <Text>Telefono</Text>
                            
                </TouchableOpacity>

                <TouchableOpacity onPress={openPlayStore} style={styles2.category}>
                            
                            <Text>Website</Text>
                            
                </TouchableOpacity>

                <TouchableOpacity onPress={openPlayStore} style={styles2.category}>
                            
                        <Text> Download Viva App </Text>
                        
                </TouchableOpacity>

        </View>


          </ScrollView>

        
        </View>  

      </View>

    </Modal>
  );

  
}

const styles2 = StyleSheet.create({
    modalContent: {
      height: '30%',
      width: '100%',
      backgroundColor: 'white',
      borderTopRightRadius: 18,
      borderTopLeftRadius: 18,
      position: 'absolute',
      bottom: 0,
    },
    titleContainer: {
      height: '16%',
      backgroundColor: '#464C55',
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      color: '#fff',
      fontSize: 16,
    },
    icon: {
      width: 100,
      height: 100,
      marginRight: 5,
      marginTop: 5,
    },

    icon2: {
      width: 35,
      height: 35,
      marginRight: 5,
      marginTop: 5,
    },
    star: {
      width: 30,
      height: 30,
      marginRight: 5,
      marginTop: 5,
     
    },
    category: {
        margin: 3,
        borderRadius: 15,
        borderWidth: 2,
        padding: 5,
        paddingHorizontal: 10,
    },
  });