module.exports = function(api) {
  api.cache(true);
  return {

    plugins: [["module:@preact/signals-react-transform"]],
    presets: ['babel-preset-expo'],
    plugins: [
			// Required for expo-router
			'expo-router/babel',
			'react-native-reanimated/plugin',
      ['@babel/plugin-transform-private-methods', { loose: true }]
     
     
    ]
  };
};


