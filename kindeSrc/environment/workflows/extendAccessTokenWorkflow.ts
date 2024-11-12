import { onUserTokenGeneratedEvent,version, createKindeAPI, getEnvironmentVariable, accessTokenCustomClaims, WorkflowSettings, WorkflowTrigger, denyAccess, fetch } from "@kinde/infrastructure"
import { settings } from "../../../utils/utils.ts";
// import { User } from "@kinde/managements-api-js/workflow"

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

// export async function createKindeAPI(baseURL: string) {
//   const M2M_CLIENT_ID = getEnvironmentVariable("WF_M2M_CLIENT_ID");
//   const M2M_CLIENT_SECRET = getEnvironmentVariable("WF_M2M_CLIENT_SECRET");

//   const errors = [];

//   if (!M2M_CLIENT_ID) {
//     errors.push("WF_M2M_CLIENT_ID not set");
//   }

//   if (!M2M_CLIENT_SECRET) {
//     errors.push("WF_M2M_CLIENT_SECRET not set");
//   }

//   if (!URLSearchParams) {
//     errors.push("url binding not available");
//   }

//   console.log('errors', errors);

//   console.log('M2MID', M2M_CLIENT_ID?.value, 'M2MSecret', M2M_CLIENT_SECRET?.value);


//   const token = await fetch(`${baseURL}/oauth2/token`, {
//     method: "POST",
//     responseFormat: "json",
//     headers:{
//       "Content-type": "application/x-www-form-urlencoded",
//     },
//     body: new URLSearchParams({
//       audience: `${baseURL}/api`,
//       grant_type: "client_credentials",
//       client_id: M2M_CLIENT_ID?.value,
//       client_secret: M2M_CLIENT_SECRET?.value,
//     }),
//   });

//   console.log(token);
  
//   const callKindeAPI = async (
//     method: "POST" | "GET" | "PUT" | "DELETE" | "PATCH",
//     endpoint: string,
//     params: Record<string, string>,
//   ) =>
//     await kinde.fetch(`${baseURL}/api/v1/${endpoint}`, {
//       method,
//       responseFormat: "json",
//       headers: {
//         authorization: `Bearer ${token.json.access_token}`,
//         "Content-Type": "application/json",
//         "accept": "application/json"
//       },
//       body: new URLSearchParams(params),
//     });
    
//   return {
//     get: async (endpoint: string, params: Record<string, string>) =>
//       await callKindeAPI("GET", endpoint, params),
//     post: async (endpoint: string, params: Record<string, string>) =>
//       await callKindeAPI("PATCH", endpoint, params),
//     put: async (endpoint: string, params: Record<string, string>) =>
//       await callKindeAPI("PUT", endpoint, params),
//     delete: async (endpoint: string, params: Record<string, string>) =>
//       await callKindeAPI("DELETE", endpoint, params),
//   };
// }


export default {
  async handle(event: onUserTokenGeneratedEvent) {
    const excludedPermissions = ['payments:create'];
    
    // const baseURL = event.context.domains.kindeDomain;
    const orgCode = event.context.organization.code;
    const userId = event.context.user.id;
    
    const kindeAPI = await createKindeAPI(event);
    console.log('log api', kindeAPI)
    console.log('package version', version);
    console.log('here');

    // console.log(kinde.env.get(

    console.log(kinde.env.get('WF_M2M_CLIENT_ID')?.value || 'NOT FOUND - ID');
    console.log(kinde.env.get('WF_M2M_CLIENT_SECRET')?.value || 'NOT FOUND - SECRET');
    
    
    const res = await kindeAPI.get(
      `organizations/${orgCode}/users/${userId}/permissions`
    );

    console.log('log api - res', res.json)
    
    const accessToken = accessTokenCustomClaims<{ hello: string; ipAddress: string; settings: string; permissions: []}>();
    accessToken.hello = "Hello there!";
    accessToken.ipAddress = event.request.ip
    accessToken.settings = settings.output
    accessToken.permissions =  res.json.permissions.filter((p) => !excludedPermissions.includes(p.key))
  }
}
