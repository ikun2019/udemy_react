const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const fileUpload = multer({
  limits: 500000,
  storage: multer.diskStorage({
    // ファイルの保存先の指定
    destination: (req, file, cb) => {
      cb(null, 'uploads/images') // 第一引数はエラー、第二引数は保存先のパス
    },
    // ファイル名を指定
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuidv4() + '.' + ext); // 第一引数はエラー、第二引数はファイル名
    },
  }),
  // サーバー側でのバリデーション
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('無効なファイルです');
    cb(error, isValid); //  第一引数はエラー、第二引数はファイルを受け入れるかどうか
  },
});

module.exports = fileUpload;