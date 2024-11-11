import { onUserTokenGeneratedEvent,  accessTokenCustomClaims, WorkflowSettings, WorkflowTrigger, denyAccess, fetch } from "@kinde/infrastructure"

export const workflowSettings: WorkflowSettings = {
  id: "addAccessTokenClaim",
  trigger: WorkflowTrigger.UserTokenGeneration,
  trigger: "user:tokens_generation",
  name: "Add Access Token Claim",
  bindings: {}
};

export default {
  async handle(event: onUserTokenGeneratedEvent) {
    const accessToken = accessTokenCustomClaims<{ hello: string; ipAddress: string; ipAdd: string}>();
    accessToken.hello = "Hello there!";
    accessToken.ipAddress = event.request.ip
  }
}
