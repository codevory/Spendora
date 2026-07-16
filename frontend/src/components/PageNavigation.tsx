import useThemeContext from '../Hooks/useThemeContext';
import type { Transaction } from '../types/recentTransactions';
import type { expenseTranscationTypes, IncomeTransactionTypes } from '../types/transactionType';
import styles from "./component.module.css"

export const PAGE_SIZE = 7;

type PageNavigationProps = {
    data:expenseTranscationTypes[] | IncomeTransactionTypes[] | Transaction[]
    isFetching: boolean
    page:number 
    setPage: (value: React.SetStateAction<number>) => void
    marginFromBottom:number | undefined
}
const PageNavigation = ({ data, isFetching, page, setPage, marginFromBottom }: PageNavigationProps) => {
    const canGoPrev = page > 1;
    const canGoNext = data?.length === PAGE_SIZE
    const { isDark } = useThemeContext()
  return (
        <div className={`glass w-[98%] flex justify-between items-center absolute bottom-${marginFromBottom ?? 11.5} left-1 bg-amber-700`}>
          <button
            onClick={() => setPage((p) => Math.max(1,(p-1)))}
            disabled={!canGoPrev || isFetching}
            className={`${styles.paginationButton} ${isDark ? ' bg-blue-800' : 'bg-blue-500'}`}
          >
            prev
          </button>
          <p>{page}</p>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!canGoNext || isFetching}
            className={`${styles.paginationButton} ${isDark ? ' bg-blue-800' : 'bg-blue-500'}`}
          >
            next
          </button>
        </div>
  )
}

export default PageNavigation
