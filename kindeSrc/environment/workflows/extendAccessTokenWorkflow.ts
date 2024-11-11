import { onUserTokenGeneratedEvent,  accessTokenCustomClaims, WorkflowSettings, WorkflowTrigger, denyAccess, fetch } from "@kinde/infrastructure"
import { settings } from "../../../utils/utils.ts";

export const workflowSettings: WorkflowSettings = {
  id: "addAccessTokenClaim",
  trigger: WorkflowTrigger.UserTokenGeneration,
  name: "Add Access Token Claim",
  bindings: {
    "kinde.accessToken": {}
  }
};

export default {
  async handle(event: onUserTokenGeneratedEvent) {
    const accessToken = accessTokenCustomClaims<{ hello: string; ipAddress: string; settings: string}>();
    accessToken.hello = "Hello there!";
    accessToken.ipAddress = event.request.ip
    accessToken.settings = settings.output
  }
}
