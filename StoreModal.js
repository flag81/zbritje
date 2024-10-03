import { Modal, View, Text, Pressable, StyleSheet, Image, ScrollView, Platform, Linking, Button, TouchableOpacity } from 'react-native';
import { Rating, RatingProps } from '@rneui/themed';


export default function StoreModal({ isVisible, children, onClose, storeDataPassed }) {

    const openPlayStore = () => {
        const appId = 'com.zs.vivafresh'; // Replace with your app's package name
        const url = `https://play.google.com/store/apps/details?id=${appId}`;
        Linking.openURL(url).catch(err => console.error("Failed to open store:", err));
      };


      const openPhone = (phoneNumber) => {
        const url = `tel:${phoneNumber}`; // Replace with your app's package name
        //const url = `https://play.google.com/store/apps/details?id=${appId}`;
        Linking.openURL(url).catch(err => console.error("Failed to open phone:", err));
      };

      const openWeb = (weburl) => {
        const url = weburl; // Replace with your app's package name
        //const url = `https://play.google.com/store/apps/details?id=${appId}`;
        Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
      };


//const [storeDataPassed, setstoreDataPassed] = useState([]);


//getstoreDataPassed(1, 1);

  const ratingCompleted = (rating) => {
    console.log('Rating is: ' + rating);
  };



//console.log("storeDataPassed",storeDataPassed);

if(storeDataPassed === undefined) {

    storeDataPassed = [];
}


const url = 'http://10.12.13.197:8800';



let storeName = '' ;
let storeImageUrl = '' ;
let storePrice = '' ;
let storeFacebookUrl = '' ;
let storeInstagramUrl = '' ;
let storePhone = '' ;
let storeAddress = '' ;
let storeWebsite = '' ;
let storeEmail = '' ;


//storeDataPassed sample data : {"categoryId": "1", "discountPercentage": null, "discountPrice": "10", "oldPrice": "12", "storeId": 4, "storeName": "Nutella", "storePic": "nutella.png", "storeSize": null, "saleEndDate": "2024-07-29T22:00:00.000Z", "saleId": 1, "saleStartDate": "2024-07-09T22:00:00.000Z", "storeId": "3", "storeLogo": "meridian.png", "subCategoryId": "10"}s

  storeDataPassed?.length > 0 ?  storeName = storeDataPassed[0]?.storeName : storeName ;


  if(storeDataPassed?.length > 0) {


        storeId = storeDataPassed[0]?.storeId;
        storeName = storeDataPassed[0]?.storeName;
        storeLogoUrl = storeDataPassed[0]?.storeLogoUrl;
        storeFacebookUrl = storeDataPassed[0]?.storeFacebookUrl;
        storeInstagramUrl = storeDataPassed[0]?.storeInstagramUrl;
        storePhone = storeDataPassed[0]?.storePhone;
        storeAddress = storeDataPassed[0]?.storeAddress;
        storeWebsite = storeDataPassed[0]?.storeWebsite;
        storeEmail = storeDataPassed[0]?.storeEmail;
        

  }



  //console.log("storeLogoUrl",storeLogoUrl);



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
            <Text>Sa jeni te kenaqur me kete kompani</Text>

        </View>

          <Rating
            showRating
            type="star"
            fractions={1}
            startingValue={3.6}
            readonly
            imageSize={20}
            onFinishRating={ratingCompleted}
            style={{ paddingVertical: 10 }} 
          />

          <View style={{flexDirection: 'col', justifyContent: 'space-between', alignItems: 'center'}}>
        

            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                {storeDataPassed?.length > 0 ? <Image source={{uri: storeLogoUrl}} style={[styles2.icon,  { paddingHorizontal:10}]} /> : null}
                <Image id="favoriteImage"
                    source={
                        storeDataPassed[0]?.isFavorite ? require('./star.png') : require('./white-star.png')
                    } style={styles2.star}
                />
            </View>

            {storeDataPassed?.length > 0 ? <Text>{storeName}</Text>  : null}
            {storeDataPassed?.length > 0 ? <Text>{storeEmail}</Text>  : null}
            {storeDataPassed?.length > 0 ? <Text>{storeAddress}</Text>  : null}
        

            { storeDataPassed[0]?.onSale ? <View style={{marginLeft: -28, zIndex: 2}}>
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