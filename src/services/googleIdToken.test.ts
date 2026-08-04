import {
  decodeJwtPayload,
  userFromGoogleIdToken,
} from "@/src/services/googleIdToken";

function makeToken(payload: Record<string, unknown>) {
  const enc = (value: string) =>
    globalThis.btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  const header = enc(JSON.stringify({ alg: "none" }));
  const body = enc(JSON.stringify(payload));
  return `${header}.${body}.sig`;
}

describe("googleIdToken", () => {
  it("decodifica el payload JWT", () => {
    const token = makeToken({ sub: "abc", email: "a@b.com", name: "Ana" });
    expect(decodeJwtPayload(token)).toMatchObject({
      sub: "abc",
      email: "a@b.com",
      name: "Ana",
    });
  });

  it("construye AuthUser desde id_token", () => {
    const token = makeToken({
      sub: "99",
      email: "ana@example.com",
      name: "Ana Verde",
      picture: "https://example.com/a.png",
    });
    expect(userFromGoogleIdToken(token)).toEqual({
      id: "google:99",
      email: "ana@example.com",
      name: "Ana Verde",
      picture: "https://example.com/a.png",
      provider: "google",
    });
  });

  it("exige sub en el token", () => {
    const token = makeToken({ email: "x@y.com" });
    expect(() => userFromGoogleIdToken(token)).toThrow(/identificador/i);
  });
});
