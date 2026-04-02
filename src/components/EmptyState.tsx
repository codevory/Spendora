import type { ReactNode } from 'react'

interface EmptyStatePropsType{
    content:ReactNode
}

const EmptyState = ({content}:EmptyStatePropsType) => {
  return (
    <div>
      {content}
    </div>
  )
}

export default EmptyState
