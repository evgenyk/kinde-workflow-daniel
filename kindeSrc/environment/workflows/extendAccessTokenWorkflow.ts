import { onUserTokenGeneratedEvent, createKindeAPI, accessTokenCustomClaims, WorkflowSettings, WorkflowTrigger, denyAccess, fetch } from "@kinde/infrastructure"
import { settings } from "../../../utils/utils.ts";

export const workflowSettings: WorkflowSettings = {
  id: "addAccessTokenClaim",
  trigger: WorkflowTrigger.UserTokenGeneration,
  name: "Add Access Token Claim",
  bindings: {
    "kinde.accessToken": {},
    "kinde.fetch": {},
    "url": {},
    "kinde.env": {},
    "console.log": {},
  }
};

export default {
  async handle(event: onUserTokenGeneratedEvent) {
    const excludedPermissions = ['payments:create'];
    
    const baseURL = event.context.domains.kindeDomain;
    const orgCode = event.context.organization.code;
    const userId = event.context.user.id;
    
    const kindeAPI = await(await createKindeAPI(baseURL))()
    console.log('log api', kindeAPI)
    const res = await kindeAPI.get(
      `organizations/${orgCode}/users/${userId}/permissions`
    );

    console.log('log api - res', res)
    const accessToken = accessTokenCustomClaims<{ hello: string; ipAddress: string; settings: string; permissions: []}>();
    accessToken.hello = "Hello there!";
    accessToken.ipAddress = event.request.ip
    accessToken.settings = settings.output
    accessToken.permissions =  res.permissions.filter((p) => !excludedPermissions.includes(p.key))
  }
}
