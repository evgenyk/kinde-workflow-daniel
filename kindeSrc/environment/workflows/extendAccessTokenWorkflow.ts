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
    const excludedPermissions = ['payments:create'];
    
    const baseURL = context.domains.kindeDomain;
    const orgCode = context.organization.code;
    const userId = context.user.id;
    
    const api = createKindeAPI(baseURL)
    const res = await kindeAPI.get(
      `organizations/${orgCode}/users/${userId}/permissions`
    );
    
    const accessToken = accessTokenCustomClaims<{ hello: string; ipAddress: string; settings: string; permissions: []}>();
    accessToken.hello = "Hello there!";
    accessToken.ipAddress = event.request.ip
    accessToken.settings = settings.output
    accessToken.permissions =  res.permissions.filter((p) => !excludedPermissions.includes(p.key))
  }
}
