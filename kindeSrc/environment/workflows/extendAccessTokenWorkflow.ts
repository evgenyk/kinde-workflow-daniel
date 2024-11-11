import { onUserTokenGeneratedEvent, createKindeAPI, accessTokenCustomClaims, WorkflowSettings, WorkflowTrigger, denyAccess, fetch } from "@kinde/infrastructure"
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
    const excludedPermissions = ['payments:create'];
    
    const baseURL = event.context.domains.kindeDomain;
    const orgCode = event.context.organization.code;
    const userId = event.context.user.id;
    
    const api = await createKindeAPI(baseURL)
  
    const res = await api.get(
      `organizations/${orgCode}/users/${userId}/permissions`
    );
    
    const accessToken = accessTokenCustomClaims<{ hello: string; ipAddress: string; settings: string; permissions: []}>();
    accessToken.hello = "Hello there!";
    accessToken.ipAddress = event.request.ip
    accessToken.settings = settings.output
    accessToken.permissions =  res.permissions.filter((p) => !excludedPermissions.includes(p.key))
  }
}
