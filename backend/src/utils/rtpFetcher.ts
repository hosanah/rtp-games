import axios from 'axios'

export async function fetchRtpData(url: string) {
  const res = await axios.get(url, {
    headers: {
      accept: 'application/x-protobuf',
      'content-type': 'application/x-protobuf'
    },
    timeout: Number(process.env.RTP_API_TIMEOUT_MS || 10000),
    family: 4,
    responseType: 'arraybuffer'
  })
  return res.data
}
