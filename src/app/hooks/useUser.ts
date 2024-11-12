//create a hook get userInfo from localStorage 'userInfo'

export const useUser = () => {
  const userInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo") as string)
    : null;

  const userId = userInfo ? userInfo.userId : null;
  const userRole = userInfo ? userInfo.role : null;

  return {
    userInfo,
    userId,
    userRole
  };
};
