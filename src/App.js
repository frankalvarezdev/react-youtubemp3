import DownloadForm from 'components/DownloadForm';
import 'rsuite/dist/rsuite.min.css';
import { CustomProvider } from 'rsuite';
import 'scss/main.scss';

function App() {
  return (
    <CustomProvider theme="dark">
      <DownloadForm />
    </CustomProvider>
  );
}

export default App;
