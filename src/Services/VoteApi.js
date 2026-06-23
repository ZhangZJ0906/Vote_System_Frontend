import { useHttpClient } from '@/Services/httpClient'

const { getApi, postApi } = useHttpClient()

export const voteApi = {


  getVoteList: () => getApi('/api/vote/list'),


  castVotes: (data) => postApi('/api/vote/cast', data),


  getVoteHistory: (userId) => getApi(`/api/vote/history?userId=${userId}`),


  addVote: (data) => postApi('/api/vote/add', data),


  deleteVote: (id) => postApi(`/api/vote/delete/${id}`)
}
