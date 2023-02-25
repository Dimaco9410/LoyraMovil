import { Component} from '@angular/core';
import { AppComponent} from '../app.component';

let pdfMake = require('pdfmake/build/pdfmake.js');
let pdfFonts = require('pdfmake/build/vfs_fonts.js');
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import {Camera, CameraOptions} from '@awesome-cordova-plugins/camera/ngx';
import {ActionSheetController} from '@ionic/angular';
import {HTTP} from '@awesome-cordova-plugins/http/ngx';
//import {ActionPerformed,PushNotificationSchema,PushNotifications,Token} from '@capacitor/push-notifications';
import Swal from 'sweetalert2';
import * as $ from "jquery";

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.page.html',
  styleUrls: ['./delivery.page.scss'],
})
export class DeliveryPage  {

  
  BaseUrl = this.Link.BaseLink();
  constructor(private http: HTTP, private Link: AppComponent, private camera: Camera, private actionSheetCtrl: ActionSheetController) { 
    this.DeliveryList();
   }

  DataHome: any;
  clickedImage: any;
  imageContent: any;

  
  DeliveryPDFServer : any;
 

//VALIDATIONS

CheckTracknumber(event: FocusEvent) {
  var Track = (<HTMLInputElement>document.getElementById('track_number')).value;
  var TrackLength = Track?.length;
  if (!TrackLength || TrackLength !== 10) {
    Swal.fire({ title: 'Error', icon: 'error', text: 'The track number provided is longer or shorter than 10 characters, please try again', heightAuto: false });
    (<HTMLInputElement>document.getElementById('track_number')).value = '';
  }
}
CheckPhoneDelivery(event: FocusEvent) {
  var Phone = (<HTMLInputElement>document.getElementById('phone_d')).value;
  var PhoneLength = Phone?.length;
  if (!PhoneLength || PhoneLength !== 10) {
    Swal.fire({ title: 'Error', icon: 'error', text: 'The phone provided is longer or shorter than 10 characters, please try again', heightAuto: false });
    (<HTMLInputElement>document.getElementById('phone_d')).value = '';
  }
}


//CAMARA


FromCamera() {

  const options: CameraOptions = {
    quality: 50,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true,
    targetWidth: 1400,
    targetHeight: 600
  }

  this.camera.getPicture(options).then((imageData) => {
    // imageData is either a base64 encoded string or a file URI
    // If it's base64 (DATA_URL):
    this.imageContent = imageData;
    let base64Image = 'data:image/jpeg;base64,' + imageData;
    this.clickedImage = base64Image;
  }, (err) => {
    console.log(err);
    // Handle error
  });
}

FromGallery() {

  const options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
    correctOrientation: true,
    targetWidth: 1400,
    targetHeight: 600
  }

  this.camera.getPicture(options).then((imageData) => {
    // imageData is either a base64 encoded string or a file URI
    // If it's base64 (DATA_URL):
    this.imageContent = imageData;
    let base64Image = 'data:image/jpeg;base64,' + imageData;
    this.clickedImage = base64Image;
  }, (err) => {
    console.log(err);
    // Handle error
  });
}

 async PictureOptions() {
  const actionSheet = await this.actionSheetCtrl.create({
    header: 'Take photo from:',
    buttons: [
      {
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          this.FromCamera();
        }
      },
      {
        text: 'Gallery',
        icon: 'folder',
        handler: () => {
          this.FromGallery();
        }
      },
      {
        text: 'Cancel',
        role: 'cancel',
        data: {
          action: 'cancel',
        },
      },
    ],
  });

  await actionSheet.present();
}


//Photo and basic data
SaveInfoDeliver(){

    $('#Preloader').show();
    $('#PhotoButton_d').attr('disabled','disabled');
    $('#savebutton_delivery').attr('disabled','disabled');
    var Photo = this.imageContent;
    var Name = $('#name_d').val();
    var TrackN = $('#track_number').val();
    var Address = $('#addres_d').val();
    var Shipto = $('#ShiptoName_d').val();
    var Phone = $('#phone_d').val();
    var status = $('#status_d').val();


    const data = {
      Photo:Photo,
      Name:Name,
      TrackN:TrackN,
      Address:Address,
      Shipto:Shipto,
      Phone:Phone,
      status:status
    };

    const headers = {
      'Content-Type' : 'application/x-www-form-urlencoded'
    }

    if(Photo!=undefined && Name!="" && TrackN!="" && Address!="" && Shipto!="" && Phone!=""){
      this.http.post(this.BaseUrl+'index.php/Delivery/SaveDeliveryALL', data, headers).then((response) =>{

        $('#Preloader').hide();
        $('#PhotoButton_d').removeAttr('disabled');
        $('#savebutton_delivery').removeAttr('disabled');

        $('#Photo').attr('src',"");
        $('#name_d').val("");
        $('#track_number').val("");
        $('#addres_d').val("");
        $('#ShiptoName_d').val("");
        $('#phone_d').val("");

       
        this.DeliveryList();
  
        
        Swal.fire({title:'Success', icon:'success', text: 'Data has been saved successfully',heightAuto:false});
        Swal.fire({title:'Success', icon:'success', text: 'La foto fue realizado exitosamente',heightAuto:false});
      }).catch(error => {

        $('#Preloader').hide();
        $('#PhotoButton_d').removeAttr('disabled');
        $('#savebutton_delivery').removeAttr('disabled');
        $('#Photo').attr('src',"");


        console.log(error.status);
        console.log(error.error);// Mensaje de eeror en una cadena.
        console.log(error.headers);


        if (error.status="timeout") {

          Swal.fire({   
            title: 'Error',
            text: 'Your device is not connected to internet or your connection is very slow.\n Please try again' ,   
            icon: 'error',   
            heightAuto:false,
            allowOutsideClick: false,
            showCancelButton: false,   
            confirmButtonColor: "#DD6B55",   
            confirmButtonText: "OK",   
            cancelButtonText: "No, Cancelar",   
          }).then((result) => {
        if (result.value) {
            $("#Preloader").hide();
            $("#savebutton_delivery").removeAttr('disabled');

            } 
          });
        }else{
          $("#Preloader").hide();
          $("#savebutton_delivery").removeAttr('disabled');
          Swal.fire({title:'Error', icon:'error', text: 'An internal server error has occurred please contact the site admin',heightAuto:false});
        }

      });
    }else{
      $("#Preloader").hide();
      $('#PhotoButton_d').removeAttr('disabled');
      $("#savebutton_delivery").removeAttr('disabled');
      Swal.fire({title:'Warning', icon:'warning', text: 'There is missing info on the form',heightAuto:false});
    }

    
    
  }

DeliveryList(){

    const data ={
     
        
    };
  
    const headers = {
      'Content-Type' : 'application/x-www-form-urlencoded'
    }
  
        this.http.get(this.BaseUrl+'index.php/Delivery/ActiveDeliveryList', data, headers).then((response) =>{
          
          console.log(response.data)
          this.DeliveryPDFServer =  JSON.parse(response.data);
          console.log(this.DeliveryPDFServer);
           
        }).catch(error => {
          
          console.log(error.status);
          console.log(error.error);// Mensaje de eeror en una cadena.
          console.log(error.headers);
        
  
          if (error.status=="timeout") {
  
            Swal.fire({   
              title: 'Error',
              text: 'Your device is not connected to internet or your connection is very slow.\n Please try again' ,   
              icon: 'error',   
              heightAuto:false,
              allowOutsideClick: false,
              showCancelButton: false,   
              confirmButtonColor: "#DD6B55",   
              confirmButtonText: "OK",   
              cancelButtonText: "No, Cancelar",   
            }).then((result) => {
          if (result.value) {
  
              } 
            });
          }else{
            Swal.fire({title:'Error', icon:'error', text: 'An internal server error has occurred please contact the site admin',heightAuto:false});
          }
  
        });
  
    } 


EditDelivery(DeID: any){

      $("#Preloader").show();
  
      var DeID = DeID;
      //var PhotoD = this.imageContent;
  
      if(DeID!=""){
  
        const data = {
          DeID:DeID
         // PhotoD:PhotoD
        };
    
        const headers = {
          'Content-Type' : 'application/x-www-form-urlencoded'
        }
  
        this.http.post(this.BaseUrl+'index.php/Delivery/DeliveryById', data, headers).then((response) =>{
  
          $('#Preloader').hide();
          
          var Object = JSON.parse(response.data);
  
         
          var id = Object[0].id_delivery;
          var Name = Object[0].sender_d;
          var TrackN = Object[0].track_d;
          var Address = Object[0].ship_address_d;
          var Shipto = Object[0].ship_to_d;
          var Phone = Object[0].phone_d;
          var status = Object[0].status;

          //$('#Photo').val(Photo);//
          $('#id_d').val(id);
          $('#name_d').val(Name);
          $('#track_number').val(TrackN);
          $('#addres_d').val(Address);
          $('#ShiptoName_d').val(Shipto);
          $('#phone_d').val(Phone);
         
          $('#status_d').val(status);

          $("#savebutton_delivery").hide(); 
          $("#Updatebutton_delivery").removeAttr('hidden');

  
        }).catch(error => {
          
          console.log(error.status);
          console.log(error.error);// Mensaje de eeror en una cadena.
          console.log(error.headers);
  
  
          if (error.status="timeout") {
  
            Swal.fire({   
              title: 'Error',
              text: 'Your device is not connected to internet or your connection is very slow.\n Please try again' ,   
              icon: 'error',   
              heightAuto:false,
              allowOutsideClick: false,
              showCancelButton: false,   
              confirmButtonColor: "#DD6B55",   
              confirmButtonText: "OK",   
              cancelButtonText: "No, Cancelar",   
            }).then((result) => {
          if (result.value) {
  
              } 
            });
          }else{
  
            Swal.fire({title:'Error', icon:'error', text: 'An internal server error has occurred please contact the site admin',heightAuto:false});
          }
  
        });
      }
    }



    

UpdateDelivery(){
    
      
      //var PhotoD = this.imageContent_D;
      var id = $('#id_d').val();
      var Name = $('#name_d').val();
      var TrackN = $('#track_number').val();
      var Address = $('#addres_d').val();
      var Shipto = $('#ShiptoName_d').val();
      var Phone = $('#phone_d').val();
      var status = $('#status_d').val();
      
      $('#Preloader').show();
      $('#Updatebutton_delivery').attr('disabled','disabled');
  
  
  
        const data = {
         // PhotoD:PhotoD,
          id:id,
          Name:Name,
          TrackN:TrackN,
          Address:Address,
          Shipto:Shipto,
          Phone:Phone,
          status:status
        };
  
        const headers = {
          'Content-Type' : 'application/x-www-form-urlencoded'
        }
  //PhotoD!=undefined && 
        if(id!="" && Name!=""&& TrackN!=""&& Address!=""&& Shipto!=""&& Phone!=""&&  status!=""){
          this.http.post(this.BaseUrl+'index.php/Delivery/EditDelivery', data, headers).then((response) =>{
            $('#Preloader').hide();
            $('#Updatebutton_delivery').removeAttr('disabled');
    
    
            
            Swal.fire({title:'Success', icon:'success', text: 'Your information has been successfully updated',heightAuto:false});
           
            this.DeliveryList();

            $('#id_d').val('');
            $('#name_d').val('');
            $('#addres_d').val('');
            $('#ShiptoName_d').val('');
            $('#phone_d').val('');
            $('#track_number').val('');
           
            $('#status_d').val('');

            $("#savebutton_delivery").show();
            $("#Updatebutton_delivery").attr("hidden",'enabled');
    
          }).catch(error => {
            
            console.log(error.status);
            console.log(error.error);// Mensaje de eeror en una cadena.
            console.log(error.headers);
    
    
            if (error.status="timeout") {
    
              Swal.fire({   
                title: 'Error',
                text: 'Your device is not connected to internet or your connection is very slow.\n Please try again' ,   
                icon: 'error',   
                heightAuto:false,
                allowOutsideClick: false,
                showCancelButton: false,   
                confirmButtonColor: "#DD6B55",   
                confirmButtonText: "OK",   
                cancelButtonText: "No, Cancelar",   
              }).then((result) => {
            if (result.value) {
                $("#Preloader").hide();
                $("#Updatebutton_delivery").removeAttr('disabled');
    
                } 
              });
            }else{
              $("#Preloader").hide();
              $("#Updatebutton_delivery").removeAttr('disabled');
              Swal.fire({title:'Error', icon:'error', text: 'An internal server error has occurred please contact the site admin',heightAuto:false});
            }
    
          });
        }else{
          $("#Preloader").hide();
          $("#Updatebutton_delivery").removeAttr('disabled');
          Swal.fire({title:'Warning', icon:'warning', text: 'There is missing info on the form',heightAuto:false});
        }
    
      }  

DeleteDelivery(Del_ID: any){

      
        var DeID2 = Del_ID;

    
          const data = {
            DeID2:DeID2
          };
      
          const headers = {
            'Content-Type' : 'application/x-www-form-urlencoded'
          }
    
          this.http.post(this.BaseUrl+'index.php/Delivery/DeleteDeliveryBD', data, headers).then((response) =>{

            Swal.fire({title:'Success', icon:'success', text: 'Delivery deleted',heightAuto:false});
            this.DeliveryList();
    
    
          }).catch(error => {
            
            console.log(error.status);
            console.log(error.error);// Mensaje de eeror en una cadena.
            console.log(error.headers);
    
    
            if (error.status="timeout") {
    
              Swal.fire({   
                title: 'Error',
                text: 'Your device is not connected to internet or your connection is very slow.\n Please try again' ,   
                icon: 'error',   
                heightAuto:false,
                allowOutsideClick: false,
                showCancelButton: false,   
                confirmButtonColor: "#DD6B55",   
                confirmButtonText: "OK",   
                cancelButtonText: "No, Cancelar",   
              }).then((result) => {
            if (result.value) {
    
                } 
              });
            }else{
    
              Swal.fire({title:'Error', icon:'error', text: 'An internal server error has occurred please contact the site admin',heightAuto:false});
            }
    
          });
        
      }  


  ngOnInit() {
  }

}
