import { type BearerTokenCredential, type Client, type ClientOptions, getClient } from "@typespec/ts-http-runtime";

export interface GithubClientContext extends Client {

}export interface GithubClientOptions extends ClientOptions {
  endpoint?: string;
}export function createGithubClientContext(
  credential: BearerTokenCredential,
  options?: GithubClientOptions,
): GithubClientContext {
  const params: Record<string, any> = {

  };
  const resolvedEndpoint = "https://api.github.com".replace(/{([^}]+)}/g, (_, key) =>
    key in params ? String(params[key]) : (() => { throw new Error(`Missing parameter: ${key}`); })()
  );;return getClient(resolvedEndpoint,{
    ...options,credential,authSchemes: [{
      kind: "http",
      scheme: "bearer"
    },
    ]
  })
}