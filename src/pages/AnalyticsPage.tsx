import Layout from '../components/Layout'

interface AnalyticsPropsType {
    onToggle:() => void;
    isOpen:boolean;
}
const AnalyticsPage = ({onToggle,isOpen}:AnalyticsPropsType) => {
  return (
    <div>
        <Layout onToggle={onToggle} isOpen={isOpen}>
     <h1>
        this is analytics page
     </h1>

        </Layout>
      
    </div>
  )
}

export default AnalyticsPage
