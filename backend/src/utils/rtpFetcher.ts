import axios from 'axios'

export async function fetchRtpData(url: string) {
  const res = await axios.get(url, {
    headers: {
      accept: 'application/x-protobuf',
      'content-type': 'application/x-protobuf'
    },
    responseType: 'arraybuffer'
  })
  return res.data
}
