import React, { useEffect, useRef, useState } from 'react';

// * カスタムコンポーネントのインポート
import Button from './Button';

// * CSSファイルのインポート
import './ImageUpload.css';

const ImageUpload = (props) => {
	const [file, setFile] = useState();
	const [previewUrl, setPreviewUrl] = useState();
	const [isValid, setIsValid] = useState(false);

	const filePickerRef = useRef();

	// * ファイルがセットされるたびに発火しプレビューするuseEffect
	useEffect(() => {
		if (!file) {
			return;
		}
		const fileReader = new FileReader();
		fileReader.onload = () => {
			setPreviewUrl(fileReader.result);
		};
		fileReader.readAsDataURL(file);
	}, [file]);

	// * ファイルが選択されたらuseStateを更新し親要素に伝達するメソッド
	const pickedHandler = (e) => {
		let pickedFile;
		let fileIsValid = isValid;
		if (e.target.files || e.target.files.length === 1) {
			pickedFile = e.target.files[0];
			setFile(pickedFile);
			setIsValid(true);
			fileIsValid = true;
		} else {
			setIsValid(false);
			fileIsValid = false;
		}
		props.onInput(props.id, pickedFile, fileIsValid);
	};

	// * input要素を選択するためのメソッド
	const pickImageHandler = () => {
		filePickerRef.current.click();
	};

	return (
		<div className="form-control">
			<input
				type="file"
				id={props.id}
				style={{ display: 'none' }}
				accept=".jpg,.png,.jpeg"
				ref={filePickerRef}
				onChange={pickedHandler}
			/>
			<div className={`image-upload ${props.center && 'center'}`}>
				<div className="image-upload__preview">
					{previewUrl && <img src={previewUrl} alt="Preview" />}
					{!previewUrl && <p>画像をアップロードしてください</p>}
				</div>
				<Button type="button" onClick={pickImageHandler}>
					PICK IMAGE
				</Button>
			</div>
			{!isValid && <p>{props.errorText}</p>}
		</div>
	);
};

export default ImageUpload;
