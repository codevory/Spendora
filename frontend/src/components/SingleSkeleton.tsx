import useThemeContext from "../Hooks/useThemeContext"

const SingleSkeleton = ({width=20, height=6}) => {
    const  { isDark } = useThemeContext()
  return (
    <span className={`single-skeleton ${isDark ? 'single-skeleton-light' : 'single-skeleton-dark'}  rounded w-${width} h-${height}`}>
    </span>
  )
}

export default SingleSkeleton
