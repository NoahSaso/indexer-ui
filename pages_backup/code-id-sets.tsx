import { AddRounded } from '@mui/icons-material'
import { useState } from 'react'

import {
  AccountCodeIdSetCard,
  Button,
  CreateCodeIdSetModal,
  EditCodeIdSetModal,
  EnsureConnected,
  Header,
  Loader,
} from '@/components'
import { useCodeIdSets } from '@/hooks'

const CodeIdSets = () => (
  <EnsureConnected>
    <InnerCodeIdSets />
  </EnsureConnected>
)

export default CodeIdSets

const InnerCodeIdSets = () => {
  const codeIdSets = useCodeIdSets()

  const [editCodeIdSetId, setEditCodeIdSetId] = useState<number>()
  const [createVisible, setCreateVisible] = useState(false)

  return (
    <>
      <Header
        rightNode={
          <Button
            onClick={() => setCreateVisible(true)}
            variant={
              codeIdSets.isFetched && codeIdSets.data?.length === 0
                ? 'primary'
                : 'secondary'
            }
          >
            <AddRounded className="!h-4 !w-4" />
            New
          </Button>
        }
        subtitle="A code ID set represents a group of code IDs that refer to a common contract. Each code ID likely corresponds to a different version of the contract."
        title="Code ID Sets"
      />

      <div className="flex flex-col gap-2 pb-6">
        {codeIdSets.isLoading ? (
          <Loader />
        ) : (
          codeIdSets.data?.map((codeIdSet) => (
            <AccountCodeIdSetCard
              key={codeIdSet.id}
              codeIdSet={codeIdSet}
              onEdit={() => setEditCodeIdSetId(codeIdSet.id)}
            />
          ))
        )}
      </div>

      <CreateCodeIdSetModal
        onClose={() => setCreateVisible(false)}
        onCreate={() => setCreateVisible(false)}
        visible={createVisible}
      />

      <EditCodeIdSetModal
        codeIdSetId={editCodeIdSetId ?? -1}
        onClose={() => setEditCodeIdSetId(undefined)}
        onEdit={() => setEditCodeIdSetId(undefined)}
        visible={editCodeIdSetId !== undefined}
      />
    </>
  )
}
