export const msalConfig = {
  auth: {
    clientId: "YOUR_MICROSOFT_CLIENT_ID",
    authority: "https://login.microsoftonline.com/common",
    //redirectUri: "http://localhost:3000",
    redirectUri: "https://airdriegujaratisamaj.ca/login",
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};