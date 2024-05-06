const FileUploadProvider = () => {
  const uploadFile = async (file) => {
    //simulate upload file service provider
    const bucket = 'posts/images/';
    const fileName = `${Date.now()}-${file.originalname}`;
    const fileUrl = `https://myserver.s3.amazonaws.com/${bucket}${fileName}`;
    return { url: fileUrl };
  };

  return {
    uploadFile,
  };
};

module.exports = {
  FileUploadProvider,
};
