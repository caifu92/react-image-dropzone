import React, { useState, useRef, DragEvent } from 'react';
import DefaultIcon from '../../images/default.png';
import './style.scss';

interface Props {
    value: string,
    onChange: (newUrl: string) => void
}

const Dropzone: React.FC<Props> = (props): JSX.Element => {
    const hiddenFileInput = useRef<HTMLInputElement>(null);
    const [errMessage, setErrMessage] = useState<string>('');
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const isCanceled = useRef<boolean>(false);

    const dragOver = (e: DragEvent): void => {
        e.preventDefault();
        if (isDragging == false) {
            setIsDragging(true);    // Needed because dragLeave event fired when dragging over child elements.
        }
    }
    
    const dragEnter = (e: DragEvent): void => {
        e.preventDefault();
        setIsDragging(true);
    }
    
    const dragLeave = (e: DragEvent): void => {
        e.preventDefault();
        setIsDragging(false);
    }
    
    const fileDrop = (e: DragEvent): void => {
        e.preventDefault();
        setIsDragging(false);
        
        const files = e.dataTransfer.files;
        notifyFileChange(files);
    }

    const handleClickUpload = (e: React.MouseEvent): void => {
        hiddenFileInput?.current?.click();
    }

    const handleCancelUpload = (e: React.MouseEvent): void => {
        isCanceled.current = true;
        setIsUploading(false);
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const files = e.target.files;
        if (files !== null)
            notifyFileChange(files);
    }

    const notifyFileChange = (files: FileList): void => {
        if (files.length) {
            var errMsg: string = '';
            let file: File = files[0];
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            
            setIsUploading(true);
            isCanceled.current = false;

            // Give 2 second delay for testing as image loading done in few miliseconds.
            setTimeout(() => {
                if (isCanceled.current === true) {  // This is unnecessary if we remove time delay
                    setIsUploading(false);
                    return;
                }

                if (validTypes.indexOf(file.type) !== -1) {
                    getBase64(file)
                        .then(base64 => {
                            if (isCanceled.current === true) {
                                setIsUploading(false);
                                return;
                            }
    
                            var image = new Image(); 
                            image.src = base64;
                            image.onload = function () {
                                if (isCanceled.current === true) {
                                    setIsUploading(false);
                                    return;
                                }
    
                                var height = image.height;
                                var width = image.width;
    
                                if (width != height) {
                                    errMsg = "The image should be square.";
                                } else {
                                    if (width != 100) {
                                        errMsg = "The image should be 100px size.";
                                    } else {
                                        // Approved through all validation. Do updation here.
                                        props.onChange(base64);
                                    }
                                }
    
                                if (errMsg) {
                                    // Display error message for 3 seconds.
                                    setErrMessage(errMsg);
                                    setTimeout(() => {
                                        setErrMessage('');
                                    }, 3000);
                                }
                                
                                setIsUploading(false);
                            };
                        })
                        .catch(err => {
                            setIsUploading(false);
                        });
                } else {
                    errMsg = "File must be a valid image.";
                    // Display error message for 3 seconds.
                    setErrMessage(errMsg);
                    setTimeout(() => {
                        setErrMessage('');
                    }, 3000);
                    setIsUploading(false);
                }
            }, 2000);
        }
    }

    const getBase64 = (file: File): Promise<any> => {
        return new Promise<any>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    return (
        <>
            <div className={"dropzone" + (isDragging ? " dropzone--active" : "")} onDragOver={dragOver} onDragEnter={dragEnter} onDragLeave={dragLeave} onDrop={fileDrop}>
                <div className="dropzone__content">
                    <div className="dropzone__logo-wrapper">
                        {isUploading && <div className="dropzone__logo-wrapper--active"></div>}
                        {props.value ? (
                            <img src={props.value} width={50} height={50} />
                        ) : (
                            <img src={DefaultIcon} />
                        )}
                    </div>
                    <div className="dropzone__text">Drag & drop here {props.value && 'to replace'}</div>
                    <div className="dropzone__separator">- or -</div>
                    {!isUploading && <a href="javascript:void(0);" className="dropzone__select-btn" onClick={handleClickUpload}>Select file to {props.value ? 'replace' : 'upload'}</a>}
                    {isUploading && <a href="javascript:void(0);" className="dropzone__cancel-btn" onClick={handleCancelUpload}>Cancel</a>}
                    <input type="file" ref={hiddenFileInput} onChange={handleFileChange} style={{display: 'none'}} />
                </div>
            </div>
            {errMessage && <div className="error-message">{errMessage}</div>}
        </>
    )
};

export default Dropzone;
