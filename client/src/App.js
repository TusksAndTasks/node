import styled, {css} from "styled-components";
import {useCallback, useState} from "react";
import {Axios} from "axios";

function App() {
  const [files, setFiles] = useState([]);
  const [archiveStatus, setArchiveStatus] = useState('None');
  const requestManager = new Axios({baseURL: 'http://localhost:3001', headers: { "Content-Type": "multipart/form-data" }})

  const postFiles = useCallback(() => {
      setArchiveStatus('Loading')
      const data = new FormData()
      files.forEach((file) => {
          data.append('files[]', file)
      });
      requestManager.post('/sendFiles', data).then(() => {
          setArchiveStatus('Done')
      })
  }, [files])

  const downloadArchive = useCallback(() => {
          window.open("http://localhost:3001/getArchive")
  }, [])

  return (
    <Container className="App">
      {
      files.length > 0 && <FileList>
        {files.map((file) => <File key={file.name}>{file.name}</File>)}
      </FileList>
      }
      <FileSelector>
          <FileSelectorTitle>Загрузить файлы</FileSelectorTitle>
          <FileInput type='file' onInput={(e) => {
              setFiles([...files, e.target.files[0]])
          }} />
      </FileSelector>
      <SendButton onClick={postFiles} disabled={files.length < 1}>Отправить</SendButton>
        {
            archiveStatus === 'Done' ?
                <DownloadButton onClick={downloadArchive}>Скачать архив</DownloadButton> : archiveStatus === 'None' ?
                    null : <Loading><div></div><div></div><div></div><div></div></Loading>
        }
    </Container>
  );
}

export default App;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #0d9ac4;
  flex-direction: column;
  gap: 20px;
`

const FileSelector = styled.div`
  position: relative;
  width: 400px;
  height: 50px;
  border: 1px solid #252525;
  border-radius: 10px;
  box-shadow: 0 1px 4px #565656;
  background-color: white;

  &:hover {
    background-color: #bebebe;
    cursor: pointer;
  }

  &:active {
    background-color: #9d9d9d;
    box-shadow: none;
  }
`

const FileSelectorTitle = styled.h2`
  font-family: 'Seymour One', sans-serif;
  font-size: 24px; 
  position: absolute;
  top: 20%;
  right: 12%;
  margin: 0;
`

const FileInput = styled.input`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  opacity: 0;
`

const FileList = styled.div`
  width: 400px;
  min-height: 50px;
  border-radius: 10px;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  padding: 10px;
`

const File = styled.div`
  font-family: 'Seymour One', sans-serif;
  font-size: 16px;
  border: 1px solid #252525;
  border-radius: 10px;
  width: 100%;
  padding: 10px 0;
  text-align: center;
`

const ButtonStyle = styled.button`
  font-family: 'Seymour One', sans-serif;
  font-size: 24px;
  width: 400px;
  height: 50px;
  border: 1px solid #252525;
  border-radius: 10px;
  box-shadow: 0 1px 4px #565656;
  background-color: white;

  &:hover {
    background-color: #bebebe;
    cursor: pointer;
  }

  &:active {
    background-color: #9d9d9d;
    box-shadow: none;
  }
`

const SendButton = styled(ButtonStyle)`
  &:disabled {
    opacity: 50%;
  }
`

const DownloadButton = styled(ButtonStyle)`
`

const Loading = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  
  & div{
    position: absolute;
    top: 33px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #fff;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }

  & div:nth-child(1) {
    left: 8px;
    animation: lds-ellipsis1 0.6s infinite;
  }
  & div:nth-child(2) {
    left: 8px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  & div:nth-child(3) {
    left: 32px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  & div:nth-child(4) {
    left: 56px;
    animation: lds-ellipsis3 0.6s infinite;
  }

  @keyframes lds-ellipsis1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes lds-ellipsis3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
  @keyframes lds-ellipsis2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(24px, 0);
    }
  
`