import session from './session.js'
function validate(){
  let id = session.get("roleId");
  let role = {
    isSuperAdmin: id=="1002",
    isAdmin: id=="1001"
  }
  return role;
}
export default validate;
