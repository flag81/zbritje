import { Modal, View, Text, Pressable, StyleSheet, Image, ScrollView } from 'react-native';

import { Rating, RatingProps } from '@rneui/themed';

export default function EmojiPicker({ isVisible, children, onClose, productData }) {


  const ratingCompleted = (rating) => {
    console.log('Rating is: ' + rating);
  };


  // productdata is passed from the parent component and is an array of objects and i need to reference the first object in the array and then the key value pair of productPic
// write code for the above

console.log("productData",productData);


const url = 'http://10.12.13.197:8800';


let productName = '' ;
let productImageUrl = '' ;
let productPrice = '' ;
let productDiscount = '' ;
let productDiscountPrice = '' ;
let productOldPrice = '' ;
let productSaleStartDate = '' ;
let productSaleEndDate = '' ;
let productSalePercentage = '' ;
let storeLogo = '' ;


//productData sample data : {"categoryId": "1", "discountPercentage": null, "discountPrice": "10", "oldPrice": "12", "productId": 4, "productName": "Nutella", "productPic": "nutella.png", "productSize": null, "saleEndDate": "2024-07-29T22:00:00.000Z", "saleId": 1, "saleStartDate": "2024-07-09T22:00:00.000Z", "storeId": "3", "storeLogo": "meridian.png", "subCategoryId": "10"}s

  productData.length > 0 ?  productName = productData[0].productName : productName ;


  if(productData.length > 0) {
    //console.log("productData",productData[0].productName);
    productImageUrl = {uri:`${url}/images/${productData[0].productPic}`};
    storeLogo = {uri:`${url}/images/${productData[0].storeLogo}`};
    productName = productData[0].productName;

    productPrice = productData[0].productPrice;
    productDiscount = productData[0].productDiscount;
    productDiscountPrice = productData[0].productDiscountPrice;
    productOldPrice = productData[0].productOldPrice;
    productSaleStartDate = productData[0].productSaleStartDate;
    productSaleEndDate = productData[0].saleEndDate;
    productSalePercentage = productData[0].productSalePercentage;

  }


  const imageUrl = {uri:`${url}/images/${productImageUrl}`};

  //let productData = productData;
  //console.log("productData",productData[0]);

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      

      <View style={styles2.modalContent}>
        <View style={styles2.titleContainer}>
          <Text style={styles2.title}>Detajet</Text>
          <Pressable onPress={onClose}>
          <Text style={styles2.title}>Mbyll X</Text>
          </Pressable>
        </View>
        
        <View style={{padding: 5,  flexDirection: 'row',  justifyContent: 'space-between', alignItems: 'center'}}> 

          <ScrollView >



          <Rating
          showRating
          type="star"
          fractions={1}
          startingValue={3.6}
          readonly
          imageSize={20}
          onFinishRating={ratingCompleted}
          style={{ paddingVertical: 10 }} />

          <View style={{flexDirection: 'col', justifyContent: 'space-between', alignItems: 'center'}}>
        
            {productData?.length > 0 ? <Image source={productImageUrl} style={[styles2.icon,  { }]} /> : null}
            {productData?.length > 0 ? <Text>{productName}</Text>  : null}
            {productData?.length > 0 ? <Image  source={storeLogo} style={[styles2.icon,  { }]} /> : null}

            <Image id="favoriteImage"
                  source={
                    productData[0]?.isFavorite ? require('./star.png') : require('./white-star.png')
                  } style={styles2.star}
            />

            { productData[0]?.onSale ? <View style={{marginLeft: -28, zIndex: 2}}>
              <Image id="saleImage" source={require('./discount-red.png')} style={styles2.icon2} /></View> 
            : null}
            
                   
            {productData.length > 0 ? <Text>{productPrice}</Text>  : null}
            {productData.length > 0 ? <Text>{productDiscount}</Text>  : null}

            
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
     
    }
  });