import { onUserTokenGeneratedEvent,  accessTokenCustomClaims, WorkflowSettings, WorkflowTrigger, denyAccess, fetch } from "@kinde/infrastructure"

export const workflowSettings: WorkflowSettings = {
  id: "addAccessTokenClaim",
  trigger: WorkflowTrigger.UserTokenGeneration,
  name: "Add Access Token Claim",
  
};
  
export default {
  async handle(event: onUserTokenGeneratedEvent) {
    kinde.accessToken.setCustomClaim('hello', "Hello there!");
  }
}