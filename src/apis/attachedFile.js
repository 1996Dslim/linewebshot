import service from '../services/request';
import { firebaseStorage } from '../services/firebase';

const AttachedFile = {
  getFiles(target, targetId) {
    return service.get(`/file/${target}/${targetId}`);
  },
  saveFile(target, targetId, data) {
    return service.post(`/file/${target}/${targetId}`, JSON.stringify(data));
  },
  deleteFile(id, fileName) {
    console.log('Delete file...', id, fileName);
    if (fileName) {
      firebaseStorage
        .ref(fileName)
        .delete()
        .then(() => { // File deleted successfully
          return service.delete(`/file/${id}`);
        })
        .catch((error) => {
          console.log('Delete file...', Object.keys(error), error.code);
          if (error.code === 'storage/object-not-found') {
            return service.delete(`/file/${id}`);
          }
          throw error;
        });
    } else {
      return service.delete(`/file/${id}`);
    }
  },
  fileFromURL(url) {
    window.open('about:blank').location.href = url;
    // firebaseStorage.ref(filename)
    //   .getDownloadURL()
    //   .then((url) => {
    //     // This can be downloaded directly:
    //     const xhr = new XMLHttpRequest();
    //     xhr.responseType = 'blob';
    //     xhr.onload = function() {
    //       const blob = xhr.response;
    //       const link = document.createElement('a');
    //       link.href = URL.createObjectURL(blob);
    //       link.download = filename.substring(filename.lastIndexOf('.'));
    //       link.click();
    //       URL.revokeObjectURL(link.href);
    //     };
    //     xhr.open('GET', url);
    //     xhr.send();
    //   })
    //   .catch((error) => {
    //     switch (error.code) {
    //       case 'storage/object-not-found':
    //         // File doesn't exist
    //         break;
    //       case 'storage/unauthorized':
    //         // User doesn't have permission to access the object
    //         break;
    //       case 'storage/canceled':
    //         // User canceled the upload
    //         break;
    //       case 'storage/unknown':
    //         // Unknown error occurred, inspect the server response
    //         break;
    //       default:
    //         break;
    //     }
    //   });
  },
};

export default AttachedFile;
