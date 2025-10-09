import {api} from './api';
const withoutEncryptionApi = [
  api.AuthAppsLogin,
  api.Users,
  api.VerifyInvitation,
  api.Tenants,
];

export {withoutEncryptionApi};
