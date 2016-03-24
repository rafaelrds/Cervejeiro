angular.module('starter')
 
.factory('FileService', function() {
  var images;
  var IMAGE_STORAGE_KEY = 'dav-images';
  var imagem = null;

  function getImagem() {
    return imagem;
  };
 
  function addImage(img) {
    imagem = img;

    window.localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(img));
  };
 
  return {
    imagem: getImagem,
    storeImage: addImage,
  }
})

.factory('ImageService', function($cordovaCamera, FileService, $q, $cordovaFile) {
    
  function optionsForType(type) {
    var source;
    switch (type) {
      case 0:
        source = Camera.PictureSourceType.CAMERA;
        break;
      case 1:
        source = Camera.PictureSourceType.PHOTOLIBRARY;
        break;
    }
    return {
    quality: 90,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: source,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: true,
    correctOrientation:true
    };
  }
 
  function saveMedia(type) {
    return $q(function(resolve, reject) {
      var options = optionsForType(type);

      $cordovaCamera.getPicture(options).then(function(imageBase64) {
      FileService.storeImage(imageBase64);
    });
    })
  }
  return {
    handleMediaDialog: saveMedia
  }
});