module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    "postcss-pxtorem":{
      rootValue: 20,
      unitPrecision: 1,
      propList: ["*"],
      selectorBlackList: [],
      replace: true,
      mediaQuery: false,
      minPixelValue: 0,
      // exclude: /node_modules/i
    }
  },
}
