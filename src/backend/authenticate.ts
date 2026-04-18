const key = {
  username: "shahijahan_123",
  password: "12340000",
  name: "Shahijahan",
  age: 21,
  image: "/default-man.webp",
};

interface AuthenticatePropsType {
  username: string;
  password: string;
}

const authenticate = ({ username, password }: AuthenticatePropsType) => {
  const grantAccess = () => {
    if (username.match(key.username) && password.match(key.password)) {
      return {
        access: true,
        status: 200,
        userDetails: {
          name: key.name,
          age: key.age,
          image: key.image,
        },
      };
    }
    return {
      access: false,
      status: 404,
    };
  };

  return grantAccess;
};

export default authenticate;
