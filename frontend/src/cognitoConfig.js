import { Amplify } from "aws-amplify";

const userPoolId =
  import.meta.env.VITE_COGNITO_USER_POOL_ID;

const userPoolClientId =
  import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID;

if (!userPoolId || !userPoolClientId) {
  throw new Error(
    "Missing Cognito environment configuration."
  );
}

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId,
      userPoolClientId,
      loginWith: {
        email: true,
      },
    },
  },
};

Amplify.configure(amplifyConfig);

export default amplifyConfig;