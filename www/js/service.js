angular.module('starter')
 
.factory('FileService', function() {
  var IMAGE_STORAGE_KEY = 'dav-images';
  var imagem = null;

  function getImagem() {
    return imagem;
  };
 
  function adicionaImagem(img) {
    imagem = img;

    window.localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(img));
  };
 
  return {
    imagem: getImagem,
    armazenaImagem: adicionaImagem,
  }
})

.factory('ImageService', function($cordovaCamera, FileService, $q, $cordovaFile) {
    
  function opcoesTipo(type) {
    var src;
    switch (type) {
      case 0:
        src = Camera.PictureSourceType.CAMERA;
        break;
      case 1:
        src = Camera.PictureSourceType.PHOTOLIBRARY;
        break;
    }
    return {
    quality: 90,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: src,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: true,
    correctOrientation:true
    };
  }
 
  function salvaMidia(type) {
    return $q(function(resolve, reject) {
      var options = opcoesTipo(type);

      $cordovaCamera.getPicture(options).then(function(imageBase64) {
      FileService.armazenaImagem(imageBase64);
    });
    })
  }
  return {
    manejaMidiaDialog: salvaMidia
  }
});