import { AuthPage } from "@components/auth-page";



export default async function Login() {

  return (
    <AuthPage
      type="login"
      registerLink={false}
      forgotPasswordLink={false}
      rememberMe={false}
    />
  );
}

