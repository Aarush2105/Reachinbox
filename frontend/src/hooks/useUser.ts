import type { User } from "../types/email";

export function useUser(): User {
  try {
    const raw = localStorage.getItem("user");
    if (raw) return JSON.parse(raw);
  } catch {
    // invalid JSON in localStorage
  }
  return { name: "Guest", email: "" };
}