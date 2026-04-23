import Vapi from '@vapi-ai/web';

// Vapi Configuration for Professional Voice Layer
// Get your Public Key from: https://dashboard.vapi.ai

const vapiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '';
const vapi = vapiKey && vapiKey !== 'your_vapi_key_here' ? new Vapi(vapiKey) : null;


export const startVapiSession = async (onMessage) => {
  try {
    const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
    
    if (!assistantId || !vapi) {
      console.warn('Vapi Assistant ID or Client missing. Falling back to native speech.');
      return null;
    }

    await vapi.start(assistantId);

    vapi.on('message', (message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        onMessage(message.transcript);
      }
    });

    return vapi;
  } catch (err) {
    console.error('Vapi Error:', err);
    return null;
  }
};

export const stopVapiSession = () => {
  vapi?.stop();
};

export default vapi;
