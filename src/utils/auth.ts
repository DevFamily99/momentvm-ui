type AuthResponse = boolean | string;

const authorized = (): AuthResponse => {
  if (typeof window !== `undefined`) {
    return localStorage.getItem('apiToken');
  }
  return false;
};
export default authorized;
