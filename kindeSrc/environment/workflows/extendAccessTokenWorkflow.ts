
export const workflowSettings = {
  id: "addAccessTokenClaim",
  trigger: "user:tokens_generation",
  name: "Add Access Token Claim",
  
};
  
export default {
  async handle(event) {
    kinde.accessToken.setCustomClaim('hello', "Hello there!");
  }
}