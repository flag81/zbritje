SELECT 
  products.productId, 
  products.productName, 
  products.productPic, 
  products.categoryId, 
  products.productSize, 
  products.subCategoryId, 
  products.storeId, 
  products.imageUrl,
  products.productUrl,
  products.productRating,
  sales.saleId, 
  sales.saleStartDate,
  sales.saleEndDate,
  sales.storeLogo, 
  sales.oldPrice, 
  sales.discountPrice,
  sales.discountPercentage, 
  store.storeLogo as storeLogo,

  CASE 
    WHEN f.id IS NOT NULL THEN true 
    ELSE false 
  END AS isFavorite,
  
  CASE 
    WHEN sf.id IS NOT NULL THEN true 
    ELSE false 
  END AS isStoreFavorite, -- Added this line to check if the store is a favorite
  
  CASE 
    WHEN CURRENT_DATE() BETWEEN sales.saleStartDate AND sales.saleEndDate THEN true 
    ELSE false 
  END AS onSale
  
FROM products
  
LEFT JOIN sales ON products.productId = sales.productId
LEFT JOIN store ON products.storeId = store.storeId
LEFT JOIN favorites f ON products.productId = f.productId
LEFT JOIN storefavorites sf ON store.storeId = sf.storeId -- Assuming the join condition is correct

  order by isFavorite DESC,sales.saleEndDate DESC, 
  isStoreFavorite DESC