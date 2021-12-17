import { NuclearService } from './NuclearService';
import { SignInRequestBody, SignInResponseBody, SignUpRequestBody, SignUpResponseBody } from './Identity.types';
import { ErrorBody } from './types';

export class NuclearIdentityService extends NuclearService {
  
  signUp(body: SignUpRequestBody) {
    return this.getJson<SignUpResponseBody, ErrorBody>(fetch(`${this.baseUrl}/signup`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(this.prepareBody(body))
    }));
  }

  signIn(body: SignInRequestBody) {
    return this.getJson<SignInResponseBody, ErrorBody>(fetch(`${this.baseUrl}/signin`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(this.prepareBody(body))
    }));
  }
}
