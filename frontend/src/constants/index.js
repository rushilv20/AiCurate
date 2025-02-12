export const STATUS_TOAST_MAP = {
  Sucesss: 'success',
  Fail: 'warning',
  Error: 'error'
};

export const API_GATEWAY_ENDPOINT = `https://${process.env.REACT_APP_SIGHT_SENSE_GATEWAY_ID}.execute-api.us-east-1.amazonaws.com/prod`;
export const API_GATEWAY_KEY_ID =
  process.env.REACT_APP_SIGHT_SENSE_API_GATEWAY_KEY_ID;

export const REGION = 'us-east-1';
