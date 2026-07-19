import {
  signIn,
  signOut,
  confirmSignIn,
  getCurrentUser,
  fetchAuthSession,
  fetchUserAttributes,
} from "aws-amplify/auth";


export async function login(email, password) {
  const result = await signIn({
    username: email,
    password,
  });

  return result;
}


export async function completeNewPassword(
  newPassword
) {
  const result = await confirmSignIn({
    challengeResponse: newPassword,
  });

  return result;
}


export async function logout() {
  await signOut();
}


export async function getAuthenticatedUser() {
  try {
    const user =
      await getCurrentUser();

    const session =
      await fetchAuthSession();

    const attributes =
      await fetchUserAttributes();

    const idToken =
      session.tokens?.idToken;

    const payload =
      idToken?.payload || {};

    const groups =
      payload["cognito:groups"] || [];

    return {
      ...user,

      email:
        attributes.email ||
        payload.email,

      employeeId:
        attributes[
          "custom:employee_id"
        ] || null,

      groups,

      role:
        getRole(groups),
    };

  } catch (error) {
    console.error(
      "Failed to get authenticated user:",
      error
    );

    return null;
  }
}


export async function getAccessToken() {
  try {
    const session =
      await fetchAuthSession();

    return (
      session.tokens
        ?.accessToken
        ?.toString() ||
      null
    );

  } catch {
    return null;
  }
}


function getRole(groups) {
  if (
    groups.includes("HR")
  ) {
    return "HR";
  }

  if (
    groups.includes("Manager")
  ) {
    return "Manager";
  }

  if (
    groups.includes("Employee")
  ) {
    return "Employee";
  }

  return null;
}