"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FirebaseService = void 0;

var _firebaseAdmin = _interopRequireDefault(require("firebase-admin"));

var _bitclassEc4f1FirebaseAdminsdk9if7n161a01abeb = _interopRequireDefault(require("../bitclass-ec4f1-firebase-adminsdk-9if7n-161a01abeb.json"));

var _storage = require("@google-cloud/storage");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class FirebaseService {
  // var firestore;
  constructor() {
    const params = {
      //clone json object into new object to make typescript happy
      type: _bitclassEc4f1FirebaseAdminsdk9if7n161a01abeb.default.type,
      projectId: _bitclassEc4f1FirebaseAdminsdk9if7n161a01abeb.default.project_id,
      privateKeyId: _bitclassEc4f1FirebaseAdminsdk9if7n161a01abeb.default.private_key_id,
      privateKey: _bitclassEc4f1FirebaseAdminsdk9if7n161a01abeb.default.private_key,
      clientEmail: _bitclassEc4f1FirebaseAdminsdk9if7n161a01abeb.default.client_email,
      clientId: _bitclassEc4f1FirebaseAdminsdk9if7n161a01abeb.default.client_id,
      authUri: _bitclassEc4f1FirebaseAdminsdk9if7n161a01abeb.default.auth_uri,
      tokenUri: _bitclassEc4f1FirebaseAdminsdk9if7n161a01abeb.default.token_uri,
      authProviderX509CertUrl: _bitclassEc4f1FirebaseAdminsdk9if7n161a01abeb.default.auth_provider_x509_cert_url,
      clientC509CertUrl: _bitclassEc4f1FirebaseAdminsdk9if7n161a01abeb.default.client_x509_cert_url
    };

    _firebaseAdmin.default.initializeApp({
      credential: _firebaseAdmin.default.credential.cert(params)
    });

    this.firestore = _firebaseAdmin.default.firestore();
  }

}

exports.FirebaseService = FirebaseService;

_defineProperty(FirebaseService, "firebaseService", new FirebaseService());