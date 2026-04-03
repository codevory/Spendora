import type { ReactNode } from 'react'

interface EmptyStatePropsType{
    content:ReactNode
}

const EmptyState = ({content}:EmptyStatePropsType) => {
  return (
    <>
      {content}
    </>
  )
}

export default EmptyState
