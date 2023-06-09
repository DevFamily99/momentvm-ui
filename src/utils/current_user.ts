import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import { User } from '../types';

const getCurrentUser = () => {
  const jwt = localStorage.getItem('apiToken');
  const user = jwtDecode(jwt);
  return { id: user.user_id.toString(), email: user.email } as User;
};

export default getCurrentUser;
