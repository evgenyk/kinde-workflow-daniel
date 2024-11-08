import { onUserTokenGeneratedEvent,  accessTokenCustomClaims, WorkflowSettings, WorkflowTrigger, denyAccess, fetch } from "@kinde/infrastructure"

export const workflowSettings: WorkflowSettings = {
  id: "addAccessTokenClaim",
  trigger: WorkflowTrigger.UserTokenGeneration,
  name: "Add Access Token Claim",
  
};
  
export default {
  async handle(event: onUserTokenGeneratedEvent) {
    const accessToken = accessTokenCustomClaims<{ hello: string; ipAddress: string; ipAdd: string}>();
    accessToken.hello = "Hello there!";
    accessToken.ipAddress = event.request.ip
  }
}