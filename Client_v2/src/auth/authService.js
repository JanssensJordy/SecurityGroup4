import auth0 from "auth0-js";
import { EventEmitter } from "events";
import authConfig from "../../auth_config.json";

const crypto = require('crypto');
//student code change start
function base64URLEncode(str) {
  return str.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
}
var verifier = base64URLEncode(crypto.randomBytes(32));

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest();
}
var challenge = base64URLEncode(sha256(verifier));

const webAuthCode = new auth0.WebAuth({
  domain: authConfig.domain,
  redirectUri: `${window.location.origin}/callback`,
  clientID: authConfig.clientId,
  responseType: "code",
  scope: "openid profile email rudy.read",
  audience: "naamapi",
  code_challenge: challenge,
  code_challenge_method:  'S256'
});

/* const webAuthAccess = new auth0.WebAuth({
  domain: authConfig.domain,
  code_verifier: AuthService.verifier,
  code: code,
  redirectUri: `${window.location.origin}/callback`,
  clientID: authConfig.clientId,
  grant_type:"authorization_code",
  responseType: "token id_token",
  scope: "openid profile email rudy.read",
  audience: "naamapi"

}); */

//student code change end
const localStorageKey = "loggedIn";
const loginEvent = "loginEvent";

class AuthService extends EventEmitter {
  idToken = null;
  profile = null;
  tokenExpiry = null;

  accessToken = null;
  accessTokenExpiry = null;

  login(customState) {
    webAuthCode.authorize({
      appState: customState
    });
  }

  logOut() {
    localStorage.removeItem(localStorageKey);

    this.idToken = null;
    this.tokenExpiry = null;
    this.profile = null;

    webAuthCode.logout({
      returnTo: `${window.location.origin}`
    });

    this.emit(loginEvent, { loggedIn: false });
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      webAuthCode.parseHash((err, code) => {
        if (err) {
          reject(err);
        } else {
          webAuthCode.parseHash((err, authResult) => {
            if (err) {
              reject(err);
            }else {
              this.localLogin(authResult);
              resolve(authResult.idToken);
            }});
        }
      });
    });
  }

  isAuthenticated() {
    return (
      Date.now() < this.tokenExpiry &&
      localStorage.getItem(localStorageKey) === "true"
    );
  }

  isIdTokenValid() {
    return (
      this.idToken &&
      this.tokenExpiry &&
      Date.now() < this.tokenExpiry
    );
  }

  getIdToken() {
    return new Promise((resolve, reject) => {
      if (this.isIdTokenValid()) {
        resolve(this.idToken);
      } else if (this.isAuthenticated()) {
        this.renewTokens().then(authResult => {
          resolve(authResult.idToken);
        }, reject);
      } else {
        resolve();
      }
    });
  }

  localLogin(authResult) {
    this.idToken = authResult.idToken;
    this.profile = authResult.idTokenPayload;
    this.tokenExpiry = new Date(this.profile.exp * 1000);
    this.accessToken = authResult.accessToken;
    this.accessTokenExpiry = new Date(Date.now() + authResult.expiresIn * 1000);

    localStorage.setItem(localStorageKey, "true");

    this.emit(loginEvent, {
      loggedIn: true,
      profile: authResult.idTokenPayload,
      state: authResult.appState || {}
    });
  }

  renewTokens() {
    return new Promise((resolve, reject) => {
      if (localStorage.getItem(localStorageKey) !== "true") {
        return reject("Not logged in");
      }

      webAuthCode.checkSession({}, (err, authResult) => {
        if (err) {
          reject(err);
        } else {
          this.localLogin(authResult);
          resolve(authResult);
        }
      });
    });
  }
  isAccessTokenValid() {
    return (
      this.accessToken &&
      this.accessTokenExpiry &&
      Date.now() < this.accessTokenExpiry
    );
  }

  getAccessToken() {
    return new Promise((resolve, reject) => {
      if (this.isAccessTokenValid()) {
        resolve(this.accessToken);
      } else {
        this.renewTokens().then(authResult => {
          resolve(authResult.accessToken);
        }, reject);
      }
    });
  }
}

const service = new AuthService();

service.setMaxListeners(5);

export default service;
