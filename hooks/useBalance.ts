import { useWallet } from '@noahsaso/cosmodal'
import { useQuery } from 'react-query'
import { useRecoilValue } from 'recoil'

import { cosmWasmClient } from '@/state'

export const useBalance = (denom: string) => {
  const client = useRecoilValue(cosmWasmClient)
  const { address } = useWallet()

  return useQuery(['balance', address], async () => {
    if (!address) {
      return
    }

    return client.getBalance(address, denom)
  })
}
