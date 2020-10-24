import React, { useEffect } from 'react';
import BottomBar from '../../components/BottomBar';
import { useDropzone } from 'react-dropzone';
import { setToolbarsVisibility } from '../../rest/util';
import './style.css';

const thumbsContainer = {
  position: 'absolute',
  top: 68,
  left: '20%',
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

let uploadedFiles = [];

function Previews(props) {
  const [files, setFiles] = React.useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
      uploadedFiles = acceptedFiles;
    }
  });

  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
        />
      </div>
    </div>
  ));

  React.useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section className="container">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <div className="upload-image-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" className="default-svg">
            <path fill="rgba(2, 35, 63, 1)" d="M14,13V17H10V13H7L12,8L17,13M19.35,10.03C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.03C2.34,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.03Z" />
          </svg>
          <p className='upload-image-text-style'>DRAG AND DROP FILES HERE</p>
        </div>
      </div>
      <aside style={thumbsContainer}>
        {thumbs}
      </aside>
    </section>
  );
}


export default function UploadPage() {
  useEffect(() => {
    setToolbarsVisibility(true, true);
  }, []);
  return (
    <div className="upload-root-view">
      <div className="sidebar">
        <p className="header-title">Site Name / Project Name</p>
        <input className="input-box" type="input" />
        <p className="header-title">Dataset Date</p>
        <input className="input-box" type="input" />
        <BottomBar />
      </div>
      <div className="upload-view">
        <Previews />       
      </div>
    </div>
  );
}