import { AUTH_URLS } from "@/config/api";

export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

export function redirectToLogin() {
  window.location.href = AUTH_URLS.login;
}

export function redirectToLogout() {
  window.location.href = AUTH_URLS.logout;
}