import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css'; 

const Api_docs = () => {
  return (
    <div className="swagger-dark-theme" style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <SwaggerUI 
        url="/public/api_specs.json"
        supportedSubmitMethods={[]}
      />
    </div>
  );
};

export default Api_docs;
