import app from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyCjzt1nYemJqvhhxgMgOyh1wLOupE1hzRs",
  authDomain: "basmet-web-app.firebaseapp.com",
  databaseURL: "https://basmet-web-app.firebaseio.com",
  projectId: "basmet-web-app",
  storageBucket: "basmet-web-app.appspot.com",
  messagingSenderId: "100655013322",
  appId: "1:100655013322:web:bd054a9ec605270e55c333",
  measurementId: "G-5ZPEZXT4P1",
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.db = app.firestore();
    this.auth = app.auth();
    this.storage = app.storage();
    this.storage.ref().constructor.prototype.guardarDocumentos = function(documentos){
        let ref=this;
        return Promise.all(documentos.map(function(file){
            return ref.child(file.alias).put(file).then(snapshot=>{
                return ref.child(file.alias).getDownloadURL();
            })
        }))
    }
  }

  estaIniciado() {
    return new Promise((resolve) => {
      this.auth.onAuthStateChanged(resolve);
    });
  }

  guardarDocumento = (nombreDocumento, documento) =>
    this.storage.ref().child(nombreDocumento).put(documento);

  devolverDocumento = (documentoUrl) =>
    this.storage.ref().child(documentoUrl).getDownloadURL();

  guardarDocumentos = (documentos) => this.storage.ref().guardarDocumentos(documentos);
  
  eliminarDocumento = (documento) => this.storage.ref().child(documento).delete();

}

export default Firebase;
