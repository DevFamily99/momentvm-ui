import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

const checkPermission = (skill: string): boolean => {
  const jwt = localStorage.getItem('apiToken');
  const user = jwtDecode(jwt);
  if (user.skills[skill]) {
    return true;
  }
  return false;
};

export default checkPermission;
