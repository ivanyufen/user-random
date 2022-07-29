import '../styles/globals.css';
import 'antd/dist/antd.css';
import { SWRConfig } from 'swr';
import axios from 'axios';

function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig value={{
      fetcher: (_, queryParam) => axios('https://randomuser.me/api/', { params: queryParam }).then(r => {
        return r.data
      })
    }}>
      <Component {...pageProps} />
    </SWRConfig>
  )
}

export default MyApp
