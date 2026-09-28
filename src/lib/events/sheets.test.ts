import { generateKeyPairSync, createVerify } from "node:crypto";
import { describe, expect, it } from "vitest";
import { buildServiceAccountJwt, sheetServiceAccountEmail } from "./sheets";

describe("buildServiceAccountJwt", () => {
  it("produces a verifiable RS256 JWT with the right claims", () => {
    const { privateKey, publicKey } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
      publicKeyEncoding: { type: "spki", format: "pem" },
    });
    const jwt = buildServiceAccountJwt("sa@project.iam.gserviceaccount.com", privateKey);
    const parts = jwt.split(".");
    expect(parts).toHaveLength(3);

    const header = JSON.parse(Buffer.from(parts[0], "base64url").toString());
    const claims = JSON.parse(Buffer.from(parts[1], "base64url").toString());
    expect(header).toEqual({ alg: "RS256", typ: "JWT" });
    expect(claims.iss).toBe("sa@project.iam.gserviceaccount.com");
    expect(claims.aud).toBe("https://oauth2.googleapis.com/token");
    expect(claims.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));

    const verifier = createVerify("RSA-SHA256");
    verifier.update(`${parts[0]}.${parts[1]}`);
    expect(verifier.verify(publicKey, parts[2], "base64url")).toBe(true);
  });
});

describe("sheetServiceAccountEmail", () => {
  it("is null when no service account env is configured", () => {
    delete process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    delete process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    delete process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
    expect(sheetServiceAccountEmail()).toBeNull();
  });

  it("reads the email from the JSON key env", () => {
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON = JSON.stringify({
      client_email: "sa@project.iam.gserviceaccount.com",
      private_key: "dummy",
    });
    expect(sheetServiceAccountEmail()).toBe("sa@project.iam.gserviceaccount.com");
    delete process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  });
});
