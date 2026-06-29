export type LoginInput = {
  email: string;
  password: string;
  remember: boolean;
};

export type LoginFieldErrors = Partial<Record<"email" | "password", string>>;

export type LoginUser = {
  id: string;
  email: string;
  name: string;
};

export type LoginSuccessResponse = {
  ok: true;
  message: string;
  user: LoginUser;
};

export type LoginErrorResponse = {
  ok: false;
  message: string;
  errors?: LoginFieldErrors;
};

export type LoginResponse = LoginSuccessResponse | LoginErrorResponse;
