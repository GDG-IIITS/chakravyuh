# Chakrvyuh API

## Deployment Notes

Set the timezone correctly(in your env vars) because there are some date time
related logic,
and some endpoints take datetime from the frontend!

```env
TZ=Asia/Kolkata
```

## Custom Verification Mode by using our API

You can use the following code in your application to mark submissions by teams,
when you have your own submission verification logic.

Make sure to set the API Key you got after creating the challenge in your
`.env` file

```shell
CKRVH_CHALLENGE_API_KEY=ckrvh_xxxxxxxxxxxx
```

```js
const CKRVH_API_BASE = 'https://api.chakravyuh.live';
const CKRVH_CHALLENGE_API_KEY = process.env.CKRVH_CHALLENGE_API_KEY;
const teamId = "teamId" // get correct teamId from your application logic
const challengeId = process.env.CKRVH_CHALLENGE_ID;
const response = await fetch(`${CKRVH_API_BASE}/challenges/verify`, {
  method: 'POST',
  headers: {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Ckrvh ${CKRVH_CHALLENGE_API_KEY}`
  },
  body: JSON.stringify({
    team: teamId,
    challenge: challengeId,
    score: 1 // send 0 to log unsucessful submission by the team
  })
});

const data = await response.json();
console.log(data);
```
