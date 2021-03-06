/* global chrome */

import React, { useCallback } from 'react';
import classNames from 'classnames';
import { useDropzone } from 'react-dropzone';
import usePort from 'src/popup/hooks/usePort';
import messageTypes from 'src/shared/messageTypes';
import channels from 'src/shared/channels';

function Upload({ className, ...rest }) {
  const progress = usePort(channels.uploadProgress) || 0;
  const onDrop = useCallback(files => {
    // workaround because files are not JSON-ifiable
    const backgroundWindow = chrome.extension.getBackgroundPage();
    backgroundWindow.filesToUpload = files;

    chrome.runtime.sendMessage({ messageType: messageTypes.uploadFiles });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      className={classNames(
        className,
        'relative flex items-center justify-center h-20 border-dashed border-2 rounded font-bold focus:outline-none transition-all duration-200 overflow-hidden',
        isDragActive
          ? 'border-brand text-brand'
          : 'border-darkgray text-darkgray hover:border-brand hover:text-brand cursor-pointer',
      )}
      {...getRootProps()}
      {...rest}
    >
      <div
        className="absolute inset-0 bg-gray"
        style={{ transform: `translateX(${(progress - 1) * 100}%)` }}
      />
      <input {...getInputProps()} />
      <span className="relative">Drop files or click here</span>
    </div>
  );
}

export default Upload;
