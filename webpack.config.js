// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // Mode: 'development' atau 'production'
  // Ditentukan via script npm, tapi bisa set default di sini
  // mode: 'development', // Sebaiknya diatur via script npm

  // Entry point aplikasi Anda
  entry: "./src/index.js", // Pastikan file ini ada di src/

  // Konfigurasi output bundle
  output: {
    filename: "bundle.js", // Nama file bundle output
    path: path.resolve(__dirname, "dist"), // Folder output (akan dibuat jika belum ada)
    clean: true, // Bersihkan folder dist sebelum build (webpack 5+)
  },

  // Konfigurasi module loaders
  module: {
    rules: [
      {
        test: /\.css$/i, // Terapkan loader untuk file .css
        // Loader dieksekusi dari kanan ke kiri: css-loader -> style-loader
        use: ["style-loader", "css-loader"],
      },
      // Anda bisa menambahkan loader lain di sini (misal babel-loader jika diperlukan)
    ],
  },

  // Konfigurasi plugin
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // Gunakan file src/index.html sebagai template
      filename: "index.html", // Nama file HTML output di folder dist
    }),
  ],

  // Konfigurasi webpack-dev-server
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"), // Folder yang di-serve oleh devServer
    },
    compress: true, // Aktifkan kompresi gzip
    port: 9000, // Port server (bisa ganti sesuai keinginan)
    open: true, // Buka browser otomatis saat server jalan
    // hot: true, // Bisa diaktifkan untuk Hot Module Replacement
    // client: {
    //   overlay: { // Menampilkan error langsung di browser
    //     errors: true,
    //     warnings: false,
    //   },
    // },
  },
};
